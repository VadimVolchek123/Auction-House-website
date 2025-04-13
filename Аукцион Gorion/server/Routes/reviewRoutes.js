const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.create); // Создать отзыв
router.get('/seller/:sellerId', reviewController.getAllForSeller); // Получить все отзывы для продавца

module.exports = router;