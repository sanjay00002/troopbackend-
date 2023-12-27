import { nanoid } from "nanoid/async";
import deductCoinsForUser from "../helpers/deductCoinsForUser";
import addCoinsForUser from "../helpers/addCoinsForUser";

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

			console.log("Deducting coins for user: " + String(userId))

			await deductCoinsForUser(userId, contestEntryPrice)

			const insertQuery =
				'INSERT INTO public."LiveContestUserPool" (id,"contestId", "userId", "socketId", "matched", "isBot", "contestEntryPrice", "stockId", "stockValue") VALUES ($1, $2, $3, $4, false, false, $5, $6, $7)';

			await pool.query(
				insertQuery,
				[id, contestId, userId, socketId, contestEntryPrice, stockId, stockValue],
				(error, result) => {
					if (error) {
						console.error("Error saving contest:", error);
						reject(error); // Reject the Promise on error
					} else {

						deleteEntryAfterInterval(id, pool, userId, contestEntryPrice, socket)
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


function deleteEntryAfterInterval(id, pool, userId, contestEntryPrice, socket) {
	setTimeout(async () => {
		try {
			console.log("35 seconds done, deleting person from pool");
			// await addCoinsForUser(userId, contestEntryPrice)
			const deleteQuery = 'DELETE FROM public."LiveContestUserPool" WHERE "id" = $1';
			const result = await pool.query(deleteQuery, [id]);

			if (result.rowCount == 1) {
				console.log("refunding coins for deleted person: " + String(userId))
				await addCoinsForUser(userId, contestEntryPrice)
			}

			socket.emit("match-not-found", "Match not found for you, you have been removed from pool")

		} catch (error) {
			console.error('Error deleting entry:', error.message);
		}
	}, 30000);
}
