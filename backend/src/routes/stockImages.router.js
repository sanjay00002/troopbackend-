import { Router } from 'express';

import StockImageController from '../controllers/stockImages.controller';
const router = Router();

router.post('/addImages', StockImageController.createStockImages);
router.get('/getAllImages', StockImageController.getAllStockImages);
router.get('/findNameImage', StockImageController.findNameImage);

module.exports = router;
