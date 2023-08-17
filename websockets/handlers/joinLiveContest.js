import { nanoid } from "nanoid/async";

export default async function joinLiveContest(socket, pool, user) {
  // const nanoid = await import('nanoid/async').then(
  //   (nanoidModule) => nanoidModule.nanoid
  // );
  const contestId = user.contest_id;
  const userId = user.user_id;
  const socketId = user.socket_id;
  const id = await nanoid(10);
  const insertQuery =
    'INSERT INTO public."LiveContestUserPool" (id,contest_id, user_id, socket_id, matched) VALUES ($1, $2, $3, $4, false)';
  pool.query(
    insertQuery,
    [id, contestId, userId, socketId],
    (error, result) => {
      if (error) {
        console.error("Error saving contest:", error);
        // Handle the error and send an appropriate response
      } else {
        console.log("Contest saved successfully");
        socket.emit("select-stock");
      }
    }
  );
}
