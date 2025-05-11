const Router = require('express');
const router = new Router();
const cartController = require('../controllers/CartController');
const authMiddleware = require('../middleware/authMiddleware'); // Авторизация

// Получение корзины
router.get('/', authMiddleware, cartController.getCart);

// Добавление товара в корзину
router.post('/', authMiddleware, cartController.addToCart);

// Удаление товара из корзины
router.delete('/:cartItemId', authMiddleware, cartController.removeFromCart);

// Очистка корзины
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
