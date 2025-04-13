const { Auction, Product, Bid } = require('../model'); // Подключаем связанные модели
const ApiError = require('../Error/errorApi');

class AuctionController {
    // Создание нового аукциона
    async create(req, res, next) {
        try {
            const { productId, start_time, end_time, starting_price, reserve_price } = req.body;

            // Проверка обязательных полей
            if (!productId || !start_time || !end_time || !starting_price) {
                return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
            }

            // Создание записи аукциона
            const auction = await Auction.create({
                productId,
                start_time,
                end_time,
                starting_price,
                reserve_price: reserve_price || null, // Резервная цена необязательна
            });

            return res.status(201).json({
                message: 'Аукцион успешно создан.',
                auction,
            });
        } catch (error) {
            console.error('Ошибка при создании аукциона:', error.message);
            next(ApiError.internal('Произошла ошибка при создании аукциона.'));
        }
    }

    // Получение всех аукционов
    async getAll(req, res, next) {
        try {
            // Получение всех аукционов с включением связанных данных (например, продукта)
            const auctions = await Auction.findAll({
                include: [
                    { model: Product, attributes: ['id', 'name', 'description', 'status'] }, // Информация о продукте
                ],
            });

            if (!auctions.length) {
                return res.status(404).json({ message: 'Аукционы не найдены.' });
            }

            return res.status(200).json(auctions);
        } catch (error) {
            console.error('Ошибка при получении всех аукционов:', error.message);
            next(ApiError.internal('Произошла ошибка при получении всех аукционов.'));
        }
    }

    // Получение конкретного аукциона по ID
    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            // Поиск аукциона с включением связанных данных (например, продукта и ставок)
            const auction = await Auction.findOne({
                where: { id },
                include: [
                    { model: Product, attributes: ['id', 'name', 'description', 'status'] }, // Продукт
                    { model: Bid, attributes: ['id', 'userId', 'bid_amount'], order: [['bid_amount', 'DESC']] }, // Ставки
                ],
            });

            if (!auction) {
                return next(ApiError.notFound('Аукцион не найден.'));
            }

            return res.status(200).json(auction);
        } catch (error) {
            console.error('Ошибка при получении аукциона по ID:', error.message);
            next(ApiError.internal('Произошла ошибка при получении аукциона.'));
        }
    }

    // Обновление статуса аукциона (например, завершение)
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return next(ApiError.badRequest('Не указан новый статус.'));
            }

            const auction = await Auction.findOne({ where: { id } });

            if (!auction) {
                return next(ApiError.notFound('Аукцион не найден.'));
            }

            auction.status = status;
            await auction.save();

            return res.status(200).json({
                message: 'Статус аукциона успешно обновлён.',
                auction,
            });
        } catch (error) {
            console.error('Ошибка при обновлении статуса аукциона:', error.message);
            next(ApiError.internal('Произошла ошибка при обновлении статуса аукциона.'));
        }
    }
}

module.exports = new AuctionController();
