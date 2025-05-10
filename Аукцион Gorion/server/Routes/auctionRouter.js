// auctionRouter.js (или аналогичный файл)
const { Router } = require('express');
const router = Router();
const auctionController = require('../controllers/auctionController');

router.post('/', auctionController.create);             // Создать аукцион
router.get('/', auctionController.getAll);                // Получить все аукционы
router.get('/:id', auctionController.getOne);             // Получить один аукцион
router.put('/:id/status', auctionController.updateStatus); // Обновление статуса аукциона
router.get('/:id/max', auctionController.getMaxPrice);             // Получить максимальную стоимость

// Новый маршрут для обновления максимальной ставки
router.put('/:id/highestBid', auctionController.updateHighestBid);

module.exports = router;
