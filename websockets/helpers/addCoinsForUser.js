import model from '../../database/models'

const { User} = model


const addCoinsForUser = (userId, coinsToAdd) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.increment('appCoins', { by: coinsToAdd });
                resolve(`Added ${coinsToAdd} coins for user ${userId}`);
            } else {
                reject(`User not found for userId ${userId} to add coins`);
            }
        } catch (error) {
            reject(`Error adding coins: ${error}`);
        }
    });
};

export default addCoinsForUser