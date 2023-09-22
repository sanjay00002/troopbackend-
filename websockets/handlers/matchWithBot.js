module.exports = async function matchWithBot(io, socket, pool, user) {
  const userId = user.user_id;
  const socketId = user.socket_id;
  const contestId = user.contest_id;
  const stock_id = user.stock_id;
  const stock_value = user.stock_value;

  console.log(
    "Hi " +
      String(userId) +
      " You are being matched with a bot and btw ur socket id is " +
      String(socketId)
  );

  const updateQuery =
    'UPDATE public."LiveContestUserPool" SET stock_id = $1, stock_value = $2 WHERE contest_id = $3 AND socket_id = $4';
  pool.query(
    updateQuery,
    [stock_id, stock_value, contestId, socketId],
    (error, result) => {
      if (error) {
        console.log("Error updating stock information for bot match");
      } else {
        console.log("Stock selected successfully");

        //TODO match this user with a bot user and refactor above code into a new function to avoid duplication
      }
    }
  );
};
