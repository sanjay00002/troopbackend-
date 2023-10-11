
import model from '../../../database/models';

const {
    LiveContest
} = model


export default {

    // Unused function
    // createLiveContest: async function (userId, liveContest){
    //     console.log("Trying to create a live contest entry")
    //     const newLiveContest = await LiveContest.create({
    //         contestDate: liveContest?.date,
    //         entryAmount: liveContest?.entryAmount,
    //         isActive: true,
    //         canJoin: true,
    //         stock1Id: liveContest?.stock1Id,
    //         stock2Id: liveContest?.stock2Id,
    //         createdBy: userId
    //     })
    //     try {
            
    //     } catch (error) {
    //         console.log("Error while creating live contest with live contest cron job controller:  ", error)
    //     }
    // }

    closeEntryToLiveContests: async function(){
        console.log("Closing live contest entry")
        const allLiveContests = await LiveContest.update({
            canJoin: false,
        },
        {
            where:{}
        })
    },

    closeLiveContests: async function(){
        console.log("CLOSING ALL LIVE CONTEST")
        const allLiveContests = await LiveContest.update({
            isActive: false,
        },
        {
            where:{}
        })
    },
    openLiveContests: async function(){
        console.log("OPENING ALL LIVE CONTESTS")
        const allLiveContests = await LiveContest.update({
            isActive: true,
            canJoin: true
        },{
            where:{}
        })
    }
}