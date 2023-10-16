import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';



import CronJobController from '../controllers/CronJobController';


require('dotenv').config();


const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

function contestClosingCronJobs () {
  cron.schedule(
    '30 15 * * *',
    () =>{
        async function closeAllContests(){
            console.log("close all normal contests")
            await CronJobController.closeAllContests()
        }
        closeAllContests()
    },
    {
        name: 'close-all-contests',
        ...scheduleOptions
    }
)
cron.schedule(
    '14 9 * * *',
    () =>{
        async function closeContestEntry(){

            await CronJobController.closeAllContestEntry()
        }
        closeContestEntry()
    },
    {
        name: 'close-all-contest-entry',
        ...scheduleOptions
    }
)
}
export {contestClosingCronJobs}