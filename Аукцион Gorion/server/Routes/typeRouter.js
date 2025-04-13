const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/roleCheckMiddleware');

router.post('/', checkRole('ADMIN'), typeController.create); // Создание типа (только для администратора)
router.get('/', typeController.getAll); // Получение всех типов

module.exports = router;