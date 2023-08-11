module.exports = function currentUserCount(io,socket,pool,contestId){
    const query = `select COUNT(*) from public."ContestParticipants" where "contestId" = $1`;

    pool.query(query,[contestId] ,(error,result)=>{
        if(error){
            console.error('Error getting user count:', error);
        }else{
            // console.log(result);
            const data = {
                count: result.rows[0].count,
                contest_id : contestId
            }
            
            io.of("/normalContest").emit('user-count',data);
        }
    })
    
}