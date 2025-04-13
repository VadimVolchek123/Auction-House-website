const { SellerReview } = require('../model'); // Подключаем модель SellerReview
const ApiError = require('../Error/errorApi');

class ReviewController {
    // Создание отзыва с рейтингом для продавца
    async create(req, res, next) {
        try {
            const { sellerId, reviewerId, reviewerRole, rating, reviewText } = req.body;

            // Проверка: все обязательные поля должны быть указаны
            if (!sellerId || !reviewerId || !reviewerRole || !rating) {
                return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
            }

            // Проверка диапазона рейтинга
            if (rating < 1 || rating > 5) {
                return next(ApiError.badRequest('Рейтинг должен быть от 1 до 5.'));
            }

            // Проверка: нельзя оставлять отзыв самому себе
            if (sellerId === reviewerId) {
                return next(ApiError.badRequest('Нельзя оставить отзыв самому себе.'));
            }

            // Создание нового отзыва
            const sellerReview = await SellerReview.create({
                sellerId,
                reviewerId,
                reviewerRole,
                rating,
                reviewText,
            });

            return res.status(201).json(sellerReview);
        } catch (error) {
            console.error('Ошибка создания отзыва:', error.message);
            next(ApiError.internal('Произошла ошибка при создании отзыва.'));
        }
    }

    // Получение всех отзывов для продавца
    async getAllForSeller(req, res, next) {
        try {
            const { sellerId } = req.params; // ID продавца, для которого нужны отзывы

            // Получение всех отзывов для указанного продавца
            const reviews = await SellerReview.findAll({ where: { sellerId } });

            // Если отзывов нет
            if (!reviews.length) {
                return res.status(404).json({ message: 'Отзывы для данного продавца не найдены.' });
            }

            return res.status(200).json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error.message);
            next(ApiError.internal('Произошла ошибка при получении отзывов.'));
        }
    }
}

module.exports = new ReviewController();
