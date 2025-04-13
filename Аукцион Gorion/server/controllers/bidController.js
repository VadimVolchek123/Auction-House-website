const { Bid, User, Auction } = require('../model'); // Подключаем модели Bid, User и Auction
const ApiError = require('../Error/errorApi');

class BidController {
    // Создание новой ставки
    async create(req, res, next) {
        try {
            const { userId, auctionId, bid_amount } = req.body;

            // Проверка обязательных полей
            if (!userId || !auctionId || !bid_amount) {
                return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
            }

            // Проверка суммы ставки (должна быть больше 0)
            if (bid_amount <= 0) {
                return next(ApiError.badRequest('Сумма ставки должна быть больше 0.'));
            }

            // Проверка существования аукциона
            const auction = await Auction.findOne({ where: { id: auctionId } });
            if (!auction) {
                return next(ApiError.badRequest('Аукцион не найден.'));
            }

            // Создание новой ставки
            const bid = await Bid.create({ userId, auctionId, bid_amount });

            return res.status(201).json({
                message: 'Ставка успешно создана.',
                bid,
            });
        } catch (error) {
            console.error('Ошибка при создании ставки:', error.message);
            next(ApiError.internal('Произошла ошибка при создании ставки.'));
        }
    }

    // Получение всех ставок для конкретного аукциона
    async getAllForAuction(req, res, next) {
        try {
            const { auctionId } = req.params;

            // Проверка существования аукциона
            const auction = await Auction.findOne({ where: { id: auctionId } });
            if (!auction) {
                return next(ApiError.badRequest('Аукцион не найден.'));
            }

            // Получение всех ставок с включением данных пользователей
            const bids = await Bid.findAll({
                where: { auctionId },
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] } // Включение данных о пользователе
                ],
                order: [['bid_amount', 'DESC']], // Сортировка ставок по убыванию суммы
            });

            if (!bids.length) {
                return res.status(404).json({ message: 'Для данного аукциона ставки не найдены.' });
            }

            return res.status(200).json(bids);
        } catch (error) {
            console.error('Ошибка при получении ставок:', error.message);
            next(ApiError.internal('Произошла ошибка при получении ставок.'));
        }
    }
}

module.exports = new BidController();
