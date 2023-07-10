module.exports = function joinContest(socket,pool,response){
    const roomId = response.data.contestId;
    const query = `select from public."Contests" where id = '${roomId}'`;

    pool.query(query)
    .then((res)=>{
        const currentCount = res.rows[0].usernumber;
        pool.query(`UPDATE public."contestInstances" SET usernumber = '${currentCount + 1}' WHERE id = '${roomId}'`)
        .then(()=>{
            console.log("count updated");
            const data ={
                id: roomId,
                count: currentCount +1
            }
            socket.emit("user-count",data);
        })
        .catch((error)=>{
            console.error('Error executing query:', error);
        })
    })
    .catch((error) => {
        console.error('Error executing query:', error);
    });
}