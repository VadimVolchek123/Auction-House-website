const { Router } = require('express');
const router = Router();
const auctionController = require('../controllers/auctionController');

router.post('/', auctionController.create); // Создать аукцион
router.get('/', auctionController.getAll); // Получить все аукционы
router.get('/:id', auctionController.getOne); // Получить информацию об одном аукционе

// Новый маршрут для изменения статуса аукциона
router.put('/:id/status', auctionController.updateStatus); // Обновить статус аукциона

module.exports = router;
