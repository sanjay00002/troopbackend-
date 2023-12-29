import model from '../../../database/models';

const { User} = model


const deductCoinsForUser = async (userId, entryAmount) => {
    try {
        const user = await User.findByPk(userId);


        if (!user) {
            throw new Error(`User not found for userId ${userId} to deduct coins`);
        }

        if (user.appCoins + user.bonusCoins < entryAmount) {
            throw new Error(`Insufficient coins for user ${userId} to deduct ${entryAmount} coins`);
        }

        // If control reaches here, it means the user exists and has sufficient coins

        if(user.bonusCoins >= entryAmount){
            user.bonusCoins -= entryAmount
            await user.save()
        }
        else{
            const remainingentryAmount = entryAmount - user.bonusCoins
            user.bonusCoins = 0
            user.appCoins -= remainingentryAmount;
            await user.save();
        }

        return `Deducted ${entryAmount} coins for user ${userId}`;
    } catch (error) {
        throw new Error(`Error deducting coins: ${error.message}`);
    }
};


export default deductCoinsForUser