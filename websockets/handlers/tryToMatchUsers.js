
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
        // const insertQuery = 'INSERT INTO "your_table_name" ("id", "selfId", "opponentId", "selfSelectedStockId", "selfOpenStockValue", "opponnetSelectedStockId", "opponnentStockOpenValue", "column8") VALUES ('value1', 'value2', 'value3', 'value4', 'value5', 'value6', 'value7', 'value8')';
        // console.log("hi")
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