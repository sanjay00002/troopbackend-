import model from '../../database/models'

const { User} = model


const deductCoinsForUser = (userId, coinsToDeduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.decrement('appCoins', { by: coinsToDeduct });
                resolve(`Deducted ${coinsToDeduct} coins for user ${userId}`);
            } else {
                reject(`User not found for userId ${userId} to deduct coins`);
            }
        } catch (error) {
            reject(`Error deducting coins: ${error}`);
        }
    });
};


export default deductCoinsForUser