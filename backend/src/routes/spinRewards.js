// spinRewardRoutes.js
import { Router } from 'express';;
import model from '../../../database/models';
const { User} = model;
const router=Router();
// Define route handlers

router.post('/slotMachine',async (req,res) => {
    const {userId}= req.body;
    const user = await User.findOne({ where: { id: userId } });
    // let ticketCounts = user.tickets;
    let ticketCounts = user.tickets;
      if(ticketCounts > 0){
        const result=spinLogic();
        const payout=calculatePayout(result, ticketCounts);
        res.json({ result, payout });
        user.tickets -= 1; // Decrease the ticket count by 1
        await user.save();
      }else{
        return res.status(400).json({ error: 'You Dont Have Enough Tickets' });
      }
});
// Define your spinLogic function
function spinLogic(){
  const prices = [
    { value: 'Silver', probability: 5 },
    { value: 'Gold', probability: 25 },
    { value: 'Copper', probability: 70 },
  ];
  // The angle one the wheel one area uses (uniform sizes)
  const priceAngle=360 / prices.length;
  let result=prices[0];
  // Generate a list of the indices based on the probabilities
  const weightedList = [];
  for (let i = 0; i < prices.length; i++) {
    for (let j = 0; j < prices[i].probability; j++){
      weightedList.push(i);
    }
  }
// Get a random index from the weightedList and use it to get the price
  const winningPriceIndex = weightedList[Math.floor(Math.random() * weightedList.length)];
  result = prices[winningPriceIndex];
  // Full spins the wheel should turn (min. 1, max. 5)
  const fullSpins=Math.floor(Math.random() * 4) + 1;
  // Offset from 0° to the start of the price
  const offsetToPrice = winningPriceIndex * priceAngle;
  // Random offset from the start of the price
  const additionalOffset = Math.floor(Math.random() * priceAngle);
  return result.value;
}
// Define a function to calculate the payout
function calculatePayout(result, ticketCounts) {
  // Define payout multipliers for each outcome
  const payoutMultipliers = {
    Silver: 10, // Payout 10 times the bet amount
    Gold: 3, // Payout 3 times the bet amount
    Copper: 0, // No payout for 'Copper'
  };
  if (result in payoutMultipliers) {
    return ticketCounts * payoutMultipliers[result];
  } else {
    return 0; // No payout for invalid outcomes
  }
}

// Export the router
module.exports=router;