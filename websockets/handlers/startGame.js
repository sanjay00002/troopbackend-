import { nanoid } from "nanoid";
import model from '../../database/models'
import getStockTokenFromId from "../helpers/getStockTokenFromId";

import getStockLTPFromToken from "../helpers/getStockLTPFromToken";

const { User} = model

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
    const selfSelectedStockToken = await getStockTokenFromId(selfSelectedStockId);
      const opponentSelectedStockToken = await getStockTokenFromId(
        opponnetSelectedStockId
      );

    const selfObj = await User.findByPk(selfId)
    const selfUserName = selfObj.username
    const opponentObj = await User.findByPk(opponentId)
    const opponentUserName = opponentObj.username


    
  
  
    const insertQuery =
      'INSERT INTO public."MatchedLiveUsers" ("id", "selfId","selfUserName", "opponentId","opponentUserName", "selfSelectedStockId","selfSelectedStockToken", "selfStockOpenValue", "opponnetSelectedStockId","opponentSelectedStockToken", "opponentStockOpenValue", "contestId", "createdAt", "updatedAt", "contestEntryPrice", "selfSocketId", "opponentSocketId", "matchStatus") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)';
    const insertResult = await pool.query(insertQuery, [
      uniqueId,
      selfId,
      selfUserName,
      opponentId,
      opponentUserName,
      selfSelectedStockId,
      selfSelectedStockToken,
      selfStockOpenValue,
      opponnetSelectedStockId,
      opponentSelectedStockToken,
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
  
    // Start game for 15 seconds. Change to 30 minutes in production
  
    setTimeout(async () => {
      console.log("Set timeout started")

      const selfStockCloseValue = await getStockLTPFromToken(selfSelectedStockToken)
      const opponentStockCloseValue = await getStockLTPFromToken(opponentSelectedStockToken)
      console.log("stock LTP successfulyl fetched")
      
      console.log("Updating")
      const winner = getWinner(selfStockOpenValue, selfStockCloseValue, opponentStockOpenValue, opponentStockCloseValue, selfId, opponentId)
      const selfStockPercentageChange = ((selfStockCloseValue-selfStockOpenValue)/selfStockOpenValue)* 100
      const opponentStockPercentageChange = ((opponentStockCloseValue - opponentStockOpenValue)/ opponentStockOpenValue)* 100
      const updateQuery = 'UPDATE public."MatchedLiveUsers" SET "selfStockCloseValue" = $1, "opponentStockCloseValue" = $2, "winner" = $3, "matchStatus" = $4, "opponentStockPercentageChange"= $5, "selfStockPercentageChange" = $6 WHERE "id" = $7'
      const updateResult = await pool.query(updateQuery, [selfStockCloseValue, opponentStockCloseValue, winner, "completed", opponentStockPercentageChange, selfStockPercentageChange, uniqueId])
  
      socket.emit('match-done', uniqueId) //not sure on this code
      socket.broadcast.to(opponentSocketId).emit('match-done', uniqueId)
    }, 15000);
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