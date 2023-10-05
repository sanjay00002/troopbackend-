//TODO write code to delete user from pool

import { nanoid } from "nanoid";
import { startGame } from "./startGame";
import getStockLTPFromToken from "../helpers/getStockLTPFromToken";
import getStockTokenFromId from "../helpers/getStockTokenFromId";

import model from '../../database/models'

const {LiveContest, LiveContestUserPool} = model

import axios from 'axios'

const matchWithBot = async (io, socket,pool,user) => {
    let bot //for destructuring of user variable, look below bot creation
    
    console.log("You are to be matched with a bot")
    const url = process.env.BACKEND_BASE_URL + 'api/v1/bot/create'
    try{
        bot = await axios.post(url)
        console.log(bot.data)

        
    }catch(error){
        console.log("Error creating bot: ")
    }

    const livecontest = await LiveContest.findByPk(user.contest_id)
    
    const selfId = user.user_id

    const selfSelectedStockId = user.stock_id

    const selfStockOpenValue = user.stock_value;

    const contestId = user.contest_id
    const contestEntryPrice = user.contest_entry_price
    const selfSocketId = user.socket_id

    const botSelectedStockId = await getBotStockId(selfSelectedStockId, livecontest)
    const botStockToken = await getStockTokenFromId(botSelectedStockId)
    const botStockLTP = await getStockLTPFromToken(botStockToken)

    
    const selectQuery = 'Select * FROM public."LiveContestUserPool" WHERE "contestId" = $1 AND "userId" = $2'
    const currentUserLiveContestUserPoolObj = await pool.query(selectQuery, [contestId, selfId])

 
    const liveContestUserPoolDbEntryId = currentUserLiveContestUserPoolObj.rows[0].id



    const currentUser = {
        userId: selfId,
        stockId: selfSelectedStockId,
        stockValue: selfStockOpenValue,
        contestId: contestId,
        contestEntryPrice: contestEntryPrice,
        socketId: selfSocketId,
        id: liveContestUserPoolDbEntryId
    }
    const userToMatchWith = {
        userId: bot.data.id,
        stockId: botSelectedStockId,
        stockValue: botStockLTP,
        socketId: "no_socket_for_bot"
    }
    
    startGame(currentUser, userToMatchWith, pool, io, socket, true)
}


//return opposite stock id of user
function getBotStockId(selfSelectedStockId,liveContestObj){
    if(selfSelectedStockId==liveContestObj.dataValues.stock1Id){
        return liveContestObj.dataValues.stock2Id
    }
    else{
        return liveContestObj.dataValues.stock1Id
    }
}

export default matchWithBot