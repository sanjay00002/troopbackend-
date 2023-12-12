import model from '../../database/models'

const { User} = model


const addWinningsAmountForUser = (userId, winningsAmount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.increment('winningsAmount', { by: winningsAmount });
                resolve(`Added ${winningsAmount} winningsAmount for user ${userId}`);
            } else {
                reject(`User not found for userId ${userId} to add winningsAmount`);
            }
        } catch (error) {
            reject(`Error adding winningsAmount: ${error}`);
        }
    });
};

export default addWinningsAmountForUser