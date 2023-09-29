module.exports = function selectStock(io, socket, pool, user) {
  return new Promise(async (resolve, reject) => {
    console.log("trying to select stock");
    const user_id = user.user_id;
    const socket_id = user.socket_id;
    const contest_id = user.contest_id;
    const stock_id = user.stock_id;
    const stock_value = user.stock_value;

    const updateQuery =
      'UPDATE public."LiveContestUserPool" SET "stockId" = $1, "stockValue" = $2 WHERE "contestId" = $3 AND "socketId" = $4 AND "userId" = $5';

    pool.query(
      updateQuery,
      [stock_id, stock_value, contest_id, socket_id, user_id],
      (error, result) => {
        if (error) {
          console.log(
            "Error updating the live contest user pool with the stock values:  ",
            error
          );
          reject(error); // Reject the promise if there's an error
        } else {
          console.log("Stock saved successfully for user");
          resolve(); // Resolve the promise if successful
        }
      }
    );
  });
};



// Try to find repeatedly for the user for 25 seconds each 1 second
// function tryToFindMatchRepeatedly(io, socket, pool, user) {
//   let found_match = false;
//   const intervalId = setInterval(function(){
//     found_match = tryToFindMatch(io,socket,pool,user)
//   }, 1000)
//   if(found_match){
//     console.log("found match")
//     clearInterval(intervalId)
//   }
//   setTimeout(function(){
//     clearInterval(intervalId)
//   }, 25000)
// }

// async function tryToFindMatch(io, socket, pool, user) {
//   const user_id = user.user_id;
//   const socket_id = user.socket_id;
//   const contest_id = user.contest_id;
//   const stock_id = user.stock_id;
//   const stock_value = user.stock_value;

//   const getQuery = 'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" <> $2 AND "matched" = false AND "userId" <> $3 AND "isBot" = false';
//   pool.query(getQuery, [contest_id, stock_id, user_id], (error, result)=>{
//     if(error){
//       console.log("Error in fetching users to match with:      ", error)
//     }
//     else{
//       const matched_user = result[0]
//       console.log(matched_user)    
//     }
//   })
// }
