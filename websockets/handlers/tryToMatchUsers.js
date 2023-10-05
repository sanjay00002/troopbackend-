//TODO uncomment out code for deletion of users from livecontestUserPool and make connections to front end to send event

import { startGame } from "./startGame";
import { nanoid } from "nanoid";
import getStockTokenFromId from "../helpers/getStockTokenFromId";
import model from "../../database/models";
import getStockLTPFromToken from "../helpers/getStockLTPFromToken";

const { MatchedLiveUsers } = model;

export async function tryToMatchUsers(io, socket, pool, user) {
  console.log("trying to run match user")
    const user_id = user.user_id;
    const socket_id = user.socket_id;
    const contest_id = user.contest_id;
    const stock_id = user.stock_id;
    const contest_entry_price = user.contest_entry_price

  let countOfPossibleMatches;
  let userToMatchWith;
  let currentUser;

  const getQuery =
    'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" <> $2 AND "matched" = false AND "userId" <> $3 AND "isBot" = false AND "contestEntryPrice" = $4';

  try {
    const result = await pool.query(getQuery, [contest_id, stock_id, user_id, contest_entry_price]);
    console.log(
      "Successfully fetched number of users we can match with: ",
      result.rows.length
    );
    countOfPossibleMatches = result.rows.length;
    userToMatchWith = result.rows[0];
  } catch (error) {
    console.error("Error fetching count", error);
  }

  const currentUserQuery =
    'SELECT * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "stockId" = $2 AND "matched" = false AND "userId" = $3 AND "isBot" = false AND "contestEntryPrice" = $4';

  try {
    const result = await pool.query(currentUserQuery, [
      contest_id,
      stock_id,
      user_id,
      contest_entry_price
    ]);
    console.log("got current user", result.rows[0]);
    currentUser = result.rows[0];
  } catch (error) {
    console.error("Error fetching current user", error);
  }

  if (countOfPossibleMatches > 0) {
    

    startGame(currentUser, userToMatchWith, pool, io, socket, false);
  } else {
    console.log("No person to match with");
  }
  
}






module.exports = tryToMatchUsers






