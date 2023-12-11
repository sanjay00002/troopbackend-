import model from '../../database/models'

const { User} = model


const deductCoinsForUser = async (userId, coinsToDeduct) => {
    try {
        const user = await User.findByPk(userId);

        if (user) {
            if (user.appCoins >= coinsToDeduct) {
                user.appCoins -= coinsToDeduct;
                await user.save();
                return `Deducted ${coinsToDeduct} coins for user ${userId}`;
            } else {
                throw new Error(`Insufficient coins for user ${userId} to deduct ${coinsToDeduct} coins`);
            }
        } else {
            throw new Error(`User not found for userId ${userId} to deduct coins`);
        }
    } catch (error) {
        throw new Error(`Error deducting coins: ${error.message}`);
    }
};


export default deductCoinsForUser