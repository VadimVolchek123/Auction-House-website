const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');

router.post('/', productController.create); // Создание продукта
router.get('/', productController.getAll); // Получение всех продуктов
router.get('/:id', productController.getOne); // Получение одного продукта

// Новый маршрут для получения продуктов продавца
router.get('/seller/:sellerId', productController.getAllBySeller); // Все продукты конкретного продавца

module.exports = router;