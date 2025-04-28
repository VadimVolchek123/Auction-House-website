const { Auction, Product, Bid } = require('../model'); // Подключаем связанные модели
const ApiError = require('../Error/errorApi');

class AuctionController {
    // Создание нового аукциона
    async create(req, res, next) {
        try {
            console.log('Данные запроса:', req.body); // Логирование данных запроса
    
            const { productId, startTime, endTime, startingPrice, reservePrice, description } = req.body;

        if (!productId || !startTime || !endTime || !startingPrice || !description) {
            return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
        }
        const auction = await Auction.create({
            productId,
            startTime,
            endTime,
            startingPrice,
            reservePrice: reservePrice || 0,
            description: description || '' // теперь передаём значение description
        });
            console.log('Привет');
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
            const auctions = await Auction.findAll({
                include: [{ model: Product, attributes: ['id', 'name', 'description', 'status'] }],
            });
            console.log("Found auctions:", auctions);
            if (!auctions.length) {
                return res.status(404).json({ message: 'Аукционы не найдены.' });
            }
            return res.status(200).json(auctions);
        } catch (error) {
            console.error('Ошибка при получении всех аукционов:', error);
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
