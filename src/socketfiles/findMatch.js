module.exports = function findMatch(io,socket,pool,user){
    
    const userId = user.user_id
    const contestId = user.contest_id
    const stock_id = user.stock_id

    const updateQuery = 'UPDATE public."live_contest_instance" SET selected_stock = $1 WHERE contest_id = $2 AND user_id = $3';
    pool.query(updateQuery, [stock_id, contestId, userId], (error, result) => {
        if (error) {
          console.error('Error saving contest:', error);
          // Handle the error and send an appropriate response
        } else {
            // console.log(result);
          console.log('stock selected successfully');
          const getQuery = 'SELECT * FROM public."live_contest_instance" WHERE contest_id = $1 AND selected_stock <> $2 AND matched = false'
          pool.query(getQuery,[contestId,stock_id], (error,result) =>{
            if(error){
                console.log('Error occured:', error);
            }else{
                const matched_user = result.rows[0];
                if(matched_user){
                    const updateQuery2 = 'UPDATE public."live_contest_instance" SET matched = true WHERE (user_id = $1 AND contest_id = $2) OR id = $3';
                    pool.query(updateQuery2,[userId,contestId,matched_user.id],(error,result)=>{
                        if(error){
                            console.log("error in matching",error);
                        }else{
                            const matched_users={
                                user1: userId,
                                user2: matched_user.user_id
                            }
                            console.log("matched");
                            
                            socket.emit("match-found",matched_users)
                            socket.broadcast.to(matched_user.user_id).emit("match-found",matched_users)

                        }
                    })
                }

            }
          })
        }
      });
}