module.exports = function currentUserCount(socket,pool,contestId){
    const query = `select usernumber from public."contestInstances" where id = '${contestId}'`;

    pool.query(query)
    .then((res)=>{
        const currentCount = res.rows[0].usernumber;
        const data ={
            id: contestId,
            count: currentCount
        }
        socket.emit("user-count",data);
    })
    .catch((error) => {
        console.error('Error executing query:', error);
    });
}