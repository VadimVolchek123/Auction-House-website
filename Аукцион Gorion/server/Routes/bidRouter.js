const Router = require('express');
const router = new Router();
const bidController = require('../controllers/bidController');

// Роуты для работы со ставками
router.post('/', bidController.create); // Создать ставку
router.get('/:auctionId', bidController.getAllForAuction); // Получить ставки для аукциона

module.exports = router;
