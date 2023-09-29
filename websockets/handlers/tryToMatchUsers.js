import MatchedLiveUser from "../../database/models/matchedliveusers";
import {nanoid} from 'nanoid'

async function tryToMatchUsers(io,socket,pool,user){

    const user_id = user.user_id;
    const socket_id = user.socket_id;
    const contest_id = user.contest_id;
    const stock_id = user.stock_id;

    let countOfPossibleMatches;
    let userToMatchWith;
    let currentUser;

    const getQuery = 'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" <> $2 AND "matched" = false AND "userId" <> $3 AND "isBot" = false'
     
    try {
        const result = await pool.query(getQuery, [contest_id, stock_id, user_id]);
        console.log("Successfully fetched number of users we can match with: ", result.rows.length);
        countOfPossibleMatches = result.rows.length;
        userToMatchWith = result.rows[0];
      } catch (error) {
        console.error("Error fetching count", error);
      }
    
      const currentUserQuery =
        'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" = $2 AND "matched" = false AND "userId" = $3 AND "isBot" = false';
    
      try {
        const result = await pool.query(currentUserQuery, [contest_id, stock_id, user_id]);
        console.log("got current user", result.rows[0]);
        currentUser = result.rows[0];
      } catch (error) {
        console.error("Error fetching current user", error);
      }
    
      if (countOfPossibleMatches > 0) {
        socket.emit("match-found", userToMatchWith.userId);
        socket.broadcast.to(userToMatchWith.socketId).emit("match-found", currentUser.userId);

        startGame(currentUser, userToMatchWith, pool)
      }
    }

    async function startGame(currentUser, userToMatchWith, pool){
        const uniqueId = nanoid(10)
        const selfId = currentUser.userId
        const opponentId = userToMatchWith.userId
        const selfSelectedStockId = currentUser.stockId
        const selfStockOpenValue = currentUser.stockValue
        const opponnetSelectedStockId = userToMatchWith.stockId
        const opponentStockOpenValue = userToMatchWith.stockValue
        const contestId = currentUser.contestId
        const createdAt = await getCurrentTimeStamp()
        const updatedAt = await getCurrentTimeStamp()

        const insertQuery = 'INSERT INTO public."MatchedLiveUsers" ("id", "selfId", "opponentId", "selfSelectedStockId", "selfStockOpenValue", "opponnetSelectedStockId", "opponentStockOpenValue", "contestId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        const result = await pool.query(insertQuery, [uniqueId, selfId, opponentId, selfSelectedStockId, selfStockOpenValue, opponnetSelectedStockId, opponentStockOpenValue, contestId, createdAt, updatedAt])
        console.log(result)
    }


async function getCurrentTimeStamp(){
  const currentTime = new Date();

// Format the current time as a string with the timezone
  const formattedTimestamp = currentTime.toLocaleString('en-US', { timeZoneName: 'short' });
  return formattedTimestamp
}

    // await pool.query(getQuery, [contest_id, stock_id, user_id],(error, result)=>{
    //     if(error){
    //         console.log("Error fetching count", error)
    //     }
    //     else{
    //         console.log("Successfully fetched number of users we can match with: ", result.rows.length)
    //         countOfPossibleMatches = result.rows.length
    //         userToMatchWith = result.rows[0]
    //     }
    // })

    // const currentUserQuery = 'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" = $2 AND "matched" = false AND "userId" = $3 AND "isBot" = false'

    // await pool.query(currentUserQuery, [contest_id, stock_id, user_id],(error, result)=>{
    //     if(error){
    //         console.log("Error fetching count", error)
    //     }
    //     else{
            
    //         console.log("got current user",result.rows[0])
    //         currentUser = result.rows[0]
    //     }
    // })


    // if(countOfPossibleMatches>0){
    //     socket.emit("match-found", userToMatchWith.userId)
    //     socket.broadcast.to(userToMatchWith.socketId).emit("match-found", currentUser.userId)

    // }




module.exports = tryToMatchUsers