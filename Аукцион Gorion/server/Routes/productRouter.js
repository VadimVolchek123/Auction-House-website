const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');

router.post('/', productController.create); // Создание продукта
router.get('/', productController.getAll); // Получение всех продуктов

// Сначала обрабатываем путь для получения продуктов продавца
router.get('/seller/:sellerId', productController.getAllBySeller); // Все продукты конкретного продавца

// Затем маршрут для получения одного продукта по id
router.get('/:id', productController.getOne); // Получение одного продукта

module.exports = router;
