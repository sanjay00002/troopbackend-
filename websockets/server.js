require("@babel/register")({
  rootMode: "upward",
});

import { Server } from "socket.io";
import { Pool } from "pg";
import { createAdapter } from "@socket.io/postgres-adapter";

import getStocks from "./stockSocket/getStocks";

import chat from "./handlers/chatWS";
import joinLiveContest from "./handlers/joinLiveContest";
import currentUserCount from "./handlers/currentUserCount";

import tryToMatchUsers from "./handlers/tryToMatchUsers";
import matchWithBot from "./handlers/matchWithBot";

import model from '../database/models';

const { User } = model;

const io = new Server({
  cors: {
    origin: "*",
  },
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});


const liveContest = io.of("/liveContest");

liveContest.on("connection", (socket) => {
  // console.log("Live contest socket connected");
  socket.emit("get-socket-id", socket.id);
  

  socket.on("add-user-to-live-contest", async (user) => {

    const canUserEnterContest = await checkIfUserHasEnoughCoins(user.user_id, user.contest_entry_price)

			if(canUserEnterContest == false){
				console.log("User does not have enough coins to enter the contest.");
			}
      else{
        await joinLiveContest(socket, pool, user);
        await tryToMatchUsers(io, socket, pool, user);
      }

  });


  socket.on("25-seconds-done", (user) => {
    console.log("25-seconds-done event fired")
    matchWithBot(io, socket,pool,user)
  });
});

const slotMachine = io.of("/slotMachine");

slotMachine.on("connection", (socket) => {
  socket.on("triggered", () => {
    console.log("Slot Machine triggered");
  });
});

io.adapter(createAdapter(pool));

io.listen(5001);


async function checkIfUserHasEnoughCoins(userId, contestEntryAmount) {
	const user = await User.findByPk(userId)
	if(user.bonusCoins + user.appCoins >= contestEntryAmount){
		return true
	}
	else{return false}
}
