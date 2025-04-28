const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration); // Регистрация нового пользователя
router.post('/login', userController.login); // Авторизация
router.get('/auth', authMiddleware, userController.check); // Проверка авторизации
router.put('/updateUser', authMiddleware, userController.update); // Обновление данных пользователя
router.get('/profile', authMiddleware, userController.profile); // Получение данных профиля

// Новый маршрут для получения покупателя или продавца
router.get('/buyer/:id', userController.getBuyerInfo); // Информация о покупателе
router.get('/seller/:id', userController.getSellerInfo); // Информация о продавце

module.exports = router;
