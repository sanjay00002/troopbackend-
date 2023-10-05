import { nanoid } from "nanoid/async";

export default async function joinLiveContest(socket, pool, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const contestId = user.contest_id;
      const userId = user.user_id;
      const socketId = user.socket_id;
      const contestEntryPrice = user.contest_entry_price;
      const stockId = user.stock_id;
      const stockValue = user.stock_value;
      const id = await nanoid(10);
      console.log(contestId, userId, socketId);

      const insertQuery =
        'INSERT INTO public."LiveContestUserPool" (id,"contestId", "userId", "socketId", "matched", "isBot", "contestEntryPrice", "stockId", "stockValue") VALUES ($1, $2, $3, $4, false, false, $5, $6, $7)';

      pool.query(
        insertQuery,
        [id, contestId, userId, socketId, contestEntryPrice, stockId, stockValue],
        (error, result) => {
          if (error) {
            console.error("Error saving contest:", error);
            reject(error); // Reject the Promise on error
          } else {
            console.log("Person saved successfully with stock information");
            // Resolve the Promise with any relevant data
            resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error); // Reject the Promise if an exception occurs
    }
  });
}
