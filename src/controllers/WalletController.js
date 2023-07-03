import model from '../models';
import { getPaymentStatus } from '../lib/paymentStatus';
const { Wallet } = model;

export default {
    updateWallet: async function (req,res){
        try{
            const walletId = req.query.wallet_id;
            const linkId = req.query.link_id;
    
            const result = await getPaymentStatus(linkId);
            if(result.status ===  true){
                try{
                    const wallet = await Wallet.findByPk(walletId);
        
                    if(wallet){
                        await wallet.update({
                            cashAmount: wallet?.cashAmount + result.amount 
                        })
                    }
                }catch (error) {
                    console.error(error);
                    return res.status(500).send("An error occurred.");
                  }
            }else{
                return res.status(500).send("Payment Not Done");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send("An error occurred.");
          }
    
        return res.status(200).send("Payment Succesfull!!");
    }
};
