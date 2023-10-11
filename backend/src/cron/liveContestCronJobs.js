import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';

import models from '../../../database/models';

import LiveContestCronJobController from '../controllers/LiveContestCronJobController';

require('dotenv').config();

const scheduleOptions = {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  };

function liveContestCronJobs () {
    cron.schedule(
        '30 15 * * *',
        () =>{
            async function closeAllLiveContests(){
                console.log("close all livecontests")
                await LiveContestCronJobController.closeLiveContests()
            }
            closeAllLiveContests()
        },
        {
            name: 'close-all-live-contests',
            ...scheduleOptions
        }
    )
    cron.schedule(
        '30 14 * * *',
        () =>{
            async function closeLiveContestEntry(){

                await LiveContestCronJobController.closeEntryToLiveContests()
            }
            closeLiveContestEntry()
        },
        {
            name: 'close-live-contest-entry',
            ...scheduleOptions
        }
    )
    cron.schedule(
        '30 9 * * *',
        () =>{
            async function openLiveContests(){
                await LiveContestCronJobController.openLiveContests()
            }
            openLiveContests()
        },
        {
            name: 'open-live-contests',
            ...scheduleOptions
        }
        
    )

}

export {liveContestCronJobs}
