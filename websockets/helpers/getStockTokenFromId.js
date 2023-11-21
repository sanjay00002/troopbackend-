import model from '../../database/models'

const { Stocks} = model


//getStockTokenFromId needs to be deprecated if we switch to zerodha


const getStockTokenFromId = async (stockId) => {
    const stockobj = await Stocks.findByPk(stockId)
    return stockobj.dataValues.token
}

const getZerodhaInstrumentsFromId = async (stockId)=>{
    const stockobj = await Stocks.findByPk(stockId)
    return stockobj.dataValues.zerodhaInstrumentToken
}


export default getStockTokenFromId;

