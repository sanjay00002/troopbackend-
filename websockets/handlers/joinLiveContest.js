import { nanoid } from "nanoid/async";

export default async function joinLiveContest(socket, pool, user) {
  // const nanoid = await import('nanoid/async').then(
  //   (nanoidModule) => nanoidModule.nanoid
  // );
  const contestId = user.contest_id;
  const userId = user.user_id;
  const socketId = user.socket_id;
  const id = await nanoid(10);
  const contestEntryPrice = user.contest_entry_price;
  console.log(contestId,userId,socketId)
  const insertQuery =
    'INSERT INTO public."LiveContestUserPool" (id,"contestId", "userId", "socketId", "matched", "isBot", "contestEntryPrice") VALUES ($1, $2, $3, $4, false, false, $5)';
  pool.query(
    insertQuery,
    [id, contestId, userId, socketId, contestEntryPrice],
    (error, result) => {
      if (error) {
        console.error("Error saving contest:", error);
        // Handle the error and send an appropriate response
      } else {
        console.log("Person saved successfully");
        socket.emit("select-stock"); // think some data has to be sent back too
      }
    }
  );

}
