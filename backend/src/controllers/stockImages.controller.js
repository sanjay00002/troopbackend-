import model from '../../../database/models';
const { StockImages } = model;

export default {
  getAllStockImages: async function (req, res) {
    const stockImages = await StockImages.findAll();
    return res.status(200).json({
      status: 'success',
      message: 'Stock Images retrieved successfully',
      data: stockImages,
    });
  },
  createStockImages: async function (req, res) {
    const stockLink = req.body.stockLink;
    const stockName = req.body.stockName;

    const stockImages = await StockImages.create({
      stockImageUrl: stockLink,
      stockName: stockName,
    });
    return res.status(200).json({
      status: 'success',
      message: 'Stock Images created successfully',
      data: stockImages,
    });
  },
  findNameImage: async function (req, res) {
    const stockName = req.query.stockName;

    const stockImage = await StockImages.findAll({
      where: {
        stockName: {
          [Op.like]: `%${stockName}%`,
        },
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Stock Images retrieved successfully',
      data: stockImage,
    });
  },
};
