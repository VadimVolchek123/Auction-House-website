const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', productController.create); // Создание продукта
router.get('/', productController.getAll); // Получение всех продуктов
// Затем маршрут для получения одного продукта по id
router.get('/:id', productController.getOne); // Получение одного продукта
// Сначала обрабатываем путь для получения продуктов продавца
router.get('/seller/:sellerId', productController.getAllBySeller); // Все продукты конкретного продавца
router.delete('/delete/:id', authMiddleware, productController.deleteProduct); // Удаление продукта


module.exports = router;
