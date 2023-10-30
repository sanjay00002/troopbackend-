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
    // '30 16 * * *',
    // '0 2 * * * *',
    () =>{
        async function closeAllContests(){
            console.log("close all normal contests")
            await CronJobController.closeAllContests()
            await CronJobController.updateStockPrices()
        }
        closeAllContests()
    },
    {
        name: 'close-all-contests',
        ...scheduleOptions
    }
)
cron.schedule(
    '59 8 * * *',
    // '14 9 * * *',
    // '59 14 * * *',
    // '50 17 * * *',
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