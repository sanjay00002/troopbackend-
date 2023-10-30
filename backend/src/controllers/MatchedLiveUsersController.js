import model from '../../../database/models';

import { Op } from 'sequelize';


const { MatchedLiveUser} = model


export default {

    getLiveContestMatches: async (req, res)=>{
        const userId = req.id
        const matches = await MatchedLiveUser.findAll({
            where:{
                [Op.or]:[
                    {selfId: userId},
                    {opponentId: userId}
                ],
            }
        })



        // arrayOfMatches.forEach(element => {
        //     element["selfUserName"] = "hello"
        //     element["opponentUserName"] = "hello"
        //     element["selfStockPercentageChange"] = ""
        //     element["opponentStockPercentageChange"] = ""
        //     element["dateOfMatch"] = element.createdAt
        //     element["selfStockToken"] = ""
        //     element["opponentStockToken"] = ""
            
        // });
        res.send(matches)   
        
    }
}
