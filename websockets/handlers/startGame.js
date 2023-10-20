import { nanoid } from "nanoid";
import getStockTokenFromId from "../helpers/getStockTokenFromId";

import getStockLTPFromToken from "../helpers/getStockLTPFromToken";

export async function startGame(currentUser, userToMatchWith, pool, io , socket, isBotMatch) {
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
    const currentUserLiveContestUserPoolId = currentUser.id
    const opponentLiveContestUserPoolId = userToMatchWith.id

    
  
  
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
    
    setTimeout(()=>{console.log("Match beginning socket event fired")
    socket.emit("match-beginning", userToMatchWith.userId);
    
    socket.broadcast
      .to(userToMatchWith.socketId)
      .emit("match-beginning", currentUser.userId);

    }, 5000)
    
  
    if(isBotMatch==false){
    const deletionQuery =
      'DELETE FROM public."LiveContestUserPool" WHERE "id" = $1 OR "id" = $2';
    const deletionResult = await pool.query(deletionQuery, [
      currentUserLiveContestUserPoolId,
      opponentLiveContestUserPoolId,
    ]);
  }else{
    const deletionQuery = 'DELETE FROM public."LiveContestUserPool" WHERE "id" = $1'
    const deletionResult = await pool.query(deletionQuery, [currentUserLiveContestUserPoolId])
  }
  
    // Start game for 10 seconds. Change to 30 minutes in production
  
    setTimeout(async () => {
      console.log("Set timeout started")

      

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
export default startGame