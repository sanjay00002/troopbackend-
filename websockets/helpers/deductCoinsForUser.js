import model from '../../database/models'

const { User} = model


const deductCoinsForUser = async (userId, coinsToDeduct) => {
    try {
        const user = await User.findByPk(userId);


        if (!user) {
            throw new Error(`User not found for userId ${userId} to deduct coins`);
        }

        if (user.appCoins + user.bonusCoins < coinsToDeduct) {
            throw new Error(`Insufficient coins for user ${userId} to deduct ${coinsToDeduct} coins`);
        }

        // If control reaches here, it means the user exists and has sufficient coins

        if(user.bonusCoins >= coinsToDeduct){
            user.bonusCoins -= coinsToDeduct
            await user.save()
        }
        else{
            const remainingCoinsToDeduct = coinsToDeduct - user.bonusCoins
            user.bonusCoins = 0
            user.appCoins -= remainingCoinsToDeduct;
            await user.save();
        }

        return `Deducted ${coinsToDeduct} coins for user ${userId}`;
    } catch (error) {
        throw new Error(`Error deducting coins: ${error.message}`);
    }
};


export default deductCoinsForUser