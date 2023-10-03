//TODO uncomment out code for deletion of users from livecontestUserPool and make connections to front end to send event


import { nanoid } from "nanoid";
import getStockTokenFromId from "../helpers/getStockTokenFromId";
import model from "../../database/models";
import getStockLTPFromToken from "../helpers/getStockLTPFromToken";

const { MatchedLiveUsers } = model;

async function tryToMatchUsers(io, socket, pool, user) {
    const user_id = user.user_id;
    const socket_id = user.socket_id;
    const contest_id = user.contest_id;
    const stock_id = user.stock_id;
    const contest_entry_price = user.contest_entry_price

  let countOfPossibleMatches;
  let userToMatchWith;
  let currentUser;

  const getQuery =
    'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" <> $2 AND "matched" = false AND "userId" <> $3 AND "isBot" = false AND "contestEntryPrice" = $4';

  try {
    const result = await pool.query(getQuery, [contest_id, stock_id, user_id, contest_entry_price]);
    console.log(
      "Successfully fetched number of users we can match with: ",
      result.rows.length
    );
    countOfPossibleMatches = result.rows.length;
    userToMatchWith = result.rows[0];
  } catch (error) {
    console.error("Error fetching count", error);
  }

  const currentUserQuery =
    'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" = $2 AND "matched" = false AND "userId" = $3 AND "isBot" = false AND "contestEntryPrice" = $4';

  try {
    const result = await pool.query(currentUserQuery, [
      contest_id,
      stock_id,
      user_id,
      contest_entry_price
    ]);
    console.log("got current user", result.rows[0]);
    currentUser = result.rows[0];
  } catch (error) {
    console.error("Error fetching current user", error);
  }

  if (countOfPossibleMatches > 0) {
    socket.emit("match-found", userToMatchWith.userId); //not sure how this code works
    socket.broadcast
      .to(userToMatchWith.socketId)
      .emit("match-found", currentUser.userId);

    startGame(currentUser, userToMatchWith, pool, io, socket);
  } else {
    console.log("No person to match with");
  }
}

async function startGame(currentUser, userToMatchWith, pool, io , socket) {
  const uniqueId = nanoid(10);
  const selfId = currentUser.userId;
  const opponentId = userToMatchWith.userId;
  const selfSelectedStockId = currentUser.stockId;
  const selfStockOpenValue = currentUser.stockValue;
  const opponnetSelectedStockId = userToMatchWith.stockId;
  const opponentStockOpenValue = userToMatchWith.stockValue;
  const contestId = currentUser.contestId;
  const createdAt = await getCurrentTimeStamp();
  const updatedAt = await getCurrentTimeStamp();
  const contestEntryPrice = currentUser.contestEntryPrice
  const selfSocketId = currentUser.socketId;
  const opponentSocketId = userToMatchWith.socketId;
  const currentUserLiveContestUserPoolId = currentUser.id;
  const opponentLiveContestUserPoolId = userToMatchWith.id;

  const insertQuery =
    'INSERT INTO public."MatchedLiveUsers" ("id", "selfId", "opponentId", "selfSelectedStockId", "selfStockOpenValue", "opponnetSelectedStockId", "opponentStockOpenValue", "contestId", "createdAt", "updatedAt", "contestEntryPrice", "selfSocketId", "opponentSocketId", "matchStatus") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
  const insertResult = await pool.query(insertQuery, [
    uniqueId,
    selfId,
    opponentId,
    selfSelectedStockId,
    selfStockOpenValue,
    opponnetSelectedStockId,
    opponentStockOpenValue,
    contestId,
    createdAt,
    updatedAt,
    contestEntryPrice,
    selfSocketId,
    opponentSocketId,
    "running"
  ]);

  // const deletionQuery =
  //   'DELETE FROM public."LiveContestUserPool" WHERE "id" = $1 OR "id" = $2';
  // const deletionResult = await pool.query(deletionQuery, [
  //   currentUserLiveContestUserPoolId,
  //   opponentLiveContestUserPoolId,
  // ]);

  // Start game for 10 seconds. Change to 30 minutes in production

  setTimeout(async () => {
    const selfStockToken = await getStockTokenFromId(selfSelectedStockId);
    const opponentStockToken = await getStockTokenFromId(
      opponnetSelectedStockId
    );

    const selfStockCloseValue = await getStockLTPFromToken(selfStockToken)
    const opponentStockCloseValue = await getStockLTPFromToken(opponentStockToken)
    console.log("stock LTP")
    
    console.log("Updating")
    const winner = getWinner(selfStockOpenValue, selfStockCloseValue, opponentStockOpenValue, opponentStockCloseValue, selfId, opponentId)
    const updateQuery = 'UPDATE public."MatchedLiveUsers" SET "selfStockCloseValue" = $1, "opponentStockCloseValue" = $2, "winner" = $3, "matchStatus" = $4  WHERE "id" = $5'
    const updateResult = await pool.query(updateQuery, [selfStockCloseValue, opponentStockCloseValue, winner, "completed", uniqueId])

    socket.emit('match-done', uniqueId) //not sure on this code
    socket.broadcast.to(opponentSocketId).emit('match-done', uniqueId)
  }, 10000);
}


function getWinner(selfStockOpenValue, selfStockCloseValue, opponentStockOpenValue, opponentStockCloseValue, selfId, opponentId){
  let winner

  if((selfStockCloseValue-selfStockOpenValue)/selfStockOpenValue > (opponentStockCloseValue-opponentStockOpenValue)/opponentStockOpenValue){
    winner = selfId
  }
  else{
    winner = opponentId
  }
  return winner
}


async function getCurrentTimeStamp() {
  const currentTime = new Date();

  // Format the current time as a string with the timezone
  const formattedTimestamp = currentTime.toLocaleString("en-US", {
    timeZoneName: "short",
  });
  return formattedTimestamp;
}



module.exports = tryToMatchUsers;
