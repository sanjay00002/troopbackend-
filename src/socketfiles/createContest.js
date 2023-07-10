module.exports = function createContest(socket,response,pool){
    // console.log("This log is on joinContest.js file");
    const id = response.data.id;
    const startTime = response.data.startTime;
    const endTime = response.data.endTime;
    const category = response.data.category;
    
    const insertQuery = 'INSERT INTO public."contestInstances" (id, starttime, endtime) VALUES ($1, $2, $3)';
  
      pool.query(insertQuery, [id, startTime, endTime], (error, result) => {
        if (error) {
          console.error('Error saving contest:', error);
          // Handle the error and send an appropriate response
        } else {
          console.log('Contest saved successfully');
          // Send a success response
        }
      });
    socket.join(id);
    console.log("Contest Created");
  }