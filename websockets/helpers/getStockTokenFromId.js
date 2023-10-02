import { Sequelize } from 'sequelize'
import model from '../../database/models'

const { Stocks} = model





const getStockTokenFromId = async (stockId) => {
    const stockobj = await Stocks.findByPk(stockId)
    return stockobj.dataValues.token
}


export default getStockTokenFromId;

