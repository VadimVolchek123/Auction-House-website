const Router = require('express');
const router = new Router();

const productRouter = require('./productRouter'); // Убедитесь, что путь правильный
const userRouter = require('./userRouter');
const auctionRouter = require('./auctionRouter');
const typeRouter = require('./typeRouter');
const bidRouter = require('./bidRouter');
const reviewRoutes = require('./reviewRoutes');
const cartRouter = require('./cartRouter');

// Подключение роутеров
router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);
router.use('/bid', bidRouter);
router.use('/auction', auctionRouter);
router.use('/review', reviewRoutes);
router.use('/cart', cartRouter);

module.exports = router;
