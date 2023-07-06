import { nanoid } from 'nanoid/async';
module.exports = function findMatch(io,socket,pool,user){
    
    const userId = user.user_id
    const socketId = user.socket_id
    const contestId = user.contest_id
    const stock_id = user.stock_id

    const updateQuery = 'UPDATE public."LiveContestUserPool" SET stock_id = $1 WHERE contest_id = $2 AND socket_id = $3';
    pool.query(updateQuery, [stock_id, contestId, socketId], (error, result) => {
        if (error) {
          console.error('Error saving contest:', error);
          // Handle the error and send an appropriate response
        } else {
            // console.log(result);
          console.log('stock selected successfully');
          const getQuery = 'SELECT * FROM public."LiveContestUserPool" WHERE contest_id = $1 AND stock_id <> $2 AND matched = false'
          pool.query(getQuery,[contestId,stock_id], (error,result) =>{
            if(error){
                console.log('Error occured:', error);
            }else{
                const matched_user = result.rows[0];
                if(matched_user){
                    const updateQuery2 = 'UPDATE public."LiveContestUserPool" SET matched = true WHERE (socket_id = $1 AND contest_id = $2) OR id = $3';
                    pool.query(updateQuery2,[socketId,contestId,matched_user.id], async (error,result)=>{
                        if(error){
                            console.log("error in matching",error);
                        }else{
                            console.log("matched");
                            const id = await nanoid(10);
                            
                            const matchedQuery = 'INSERT INTO public."MatchedLiveUsers" ("id", "selfId", "apponentId", "selfSelectedStockId", "apponnetSelectedStockId", "contestId") VALUES ($1, $2, $3, $4, $5, $6)';

                            pool.query(matchedQuery,[id, userId, matched_user.user_id, stock_id, matched_user.stock_id, contestId], (error,result)=>{
                                if(error){
                                    console.log("error in matching",error);
                                }else{
                                    console.log("Matched users registered in history");
                                }
                            })

                            const deleteQuery = 'DELETE FROM public."LiveContestUserPool" WHERE matched = true';
                            pool.query(deleteQuery,(error,result)=>{
                                if(error) {
                                    console.log("error in deleting", error);
                                }else{
                                    console.log("Deleted matched users");
                                }
                            })

                            socket.emit("match-found",matched_user.user_id)
                            socket.broadcast.to(matched_user.socket_id).emit("match-found",userId)

                        }
                    })
                }

            }
          })
        }
      });
}