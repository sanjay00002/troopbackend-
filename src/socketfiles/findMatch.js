import { nanoid } from 'nanoid/async';
module.exports = function findMatch(io,socket,pool,user){
    
    const userId = user.user_id
    const socketId = user.socket_id
    const contestId = user.contest_id
    const stock_id = user.stock_id
    const stock_value = user.stock_value

    const updateQuery = 'UPDATE public."LiveContestUserPool" SET stock_id = $1, stock_value = $2 WHERE contest_id = $3 AND socket_id = $4';
    pool.query(updateQuery, [stock_id,stock_value, contestId, socketId], (error, result) => {
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
                            
                            const matchedQuery = 'INSERT INTO public."MatchedLiveUsers" ("id", "selfId", "apponentId", "selfSelectedStockId", "selfStockOpenValue", "apponnetSelectedStockId", "apponentStockOpenValue", "contestId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

                            pool.query(matchedQuery,[id, userId, matched_user.user_id, stock_id, stock_value, matched_user.stock_id, matched_user.stock_value, contestId], (error,result)=>{
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
                            
                            var isEnd = false
                            setTimeout(() => {
                                
                                if(isEnd !== true){
                                    const stock1 = user.stockFlow.stock1
                                    const stock2 = user.stockFlow.stock2
                                    const initStockValue = {};
                                    const getQuery = 'SELECT * FROM public."MatchedLiveUsers" WHERE id = $1'
                                    pool.query(getQuery, [id], (error,result)=>{
                                        if(error){console.log("No such match found" + error);}
                                        else {
                                            console.log(result);
                                            // initStockValue = {
                                            //     initStock1: result
                                            // }
                                        }
                                    })
                                    // check for self
                                    if(stock_id === stock1){
                                        
                                    }else{

                                    }
                                }
                                
                                isEnd = true;
                            }, 30000);
                        }
                    })
                }

            }
          })
        }
      });
}