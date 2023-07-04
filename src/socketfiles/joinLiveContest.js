module.exports = function joinLiveContest(socket,pool,user){
    const contestId = user.contest_id
    const userId = user.user_id
    const id = Math.floor(Math.random() * (1000 - 0 + 1))
    const insertQuery = 'INSERT INTO public."live_contest_instance" (id,contest_id, user_id) VALUES ($1, $2, $3)';
    pool.query(insertQuery, [id, contestId, userId], (error, result) => {
        if (error) {
          console.error('Error saving contest:', error);
          // Handle the error and send an appropriate response
        } else {
          console.log('Contest saved successfully');
          socket.emit("select-stock")
        }
      });
}