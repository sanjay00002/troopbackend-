import model from '../../../database/models';

import { Op } from 'sequelize';


const { MatchedLiveUser} = model


export default {

    getLiveContestMatches: async (req, res)=>{
        const userId = req.body.userId
        const matches = await MatchedLiveUser.findAll({
            where:{
                [Op.or]:[
                    {selfId: userId},
                    {opponentId: userId}
                ],
            }
        })
        console.log(matches[0])
        res.send(matches)
        
    }
}