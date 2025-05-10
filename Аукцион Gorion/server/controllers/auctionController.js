const { Auction, Product, Bid } = require('../model'); // Подключаем связанные модели
const ApiError = require('../Error/errorApi');

class AuctionController {
  // Создание нового аукциона
  async create(req, res, next) {
    try {
      console.log('Данные запроса:', req.body);
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
        description: description || ''
      });
      console.log('Аукцион создан');
      return res.status(201).json({
        message: 'Аукцион успешно создан.',
        auction
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
        include: [{ model: Product, attributes: ['id', 'name', 'description', 'status'] }]
      });
      console.log("Найдены аукционы:", auctions);
      if (!auctions || auctions.length === 0) {
        return res.status(200).json({ message: 'Аукционы не найдены.' });
      }
      return res.status(200).json(auctions);
    } catch (error) {
      console.error('Ошибка при получении всех аукционов:', error);
      return res.status(500).json({ message: 'Произошла ошибка при получении всех аукционов.' });
    }
  }

  // Получение конкретного аукциона по ID с включением связанных данных
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const auction = await Auction.findOne({
        where: { id },
        include: [
          { model: Product, attributes: ['id', 'name', 'description', 'status'] },
          { 
            model: Bid, 
            attributes: ['id', 'userId', 'bidAmount'],
            separate: true,
            order: [['bidAmount', 'DESC']]
          }
        ]
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
        auction
      });
    } catch (error) {
      console.error('Ошибка при обновлении статуса аукциона:', error.message);
      next(ApiError.internal('Произошла ошибка при обновлении статуса аукциона.'));
    }
  }

  // Обновление максимальной (наивысшей) ставки для аукциона
  async updateHighestBid(req, res, next) {
    try {
      const { id } = req.params;
      // Получаем аукцион
      const auction = await Auction.findOne({ where: { id } });
      if (!auction) {
        return res.status(404).json({ message: 'Аукцион не найден.' });
      }

      // Получаем все ставки для данного аукциона
      const bids = await Bid.findAll({ where: { auctionId: id } });

      // Если ставок нет, максимум равен стартовой цене, а highestBidId остаётся null
      let maxBid = auction.startingPrice;
      let highestBidId = null;
      if (bids && bids.length > 0) {
        // Находим ставку с максимальным значением bidAmount
        const highestBid = bids.reduce((max, bid) =>
          bid.bidAmount > max.bidAmount ? bid : max,
          { bidAmount: auction.startingPrice }
        );
        maxBid = highestBid.bidAmount;
        highestBidId = highestBid.id;
      }

      // Обновляем аукцион с новыми значениями
      auction.highestBid = maxBid;
      auction.highestBidId = highestBidId;
      await auction.save();

      return res.status(200).json({
        message: 'Максимальная ставка успешно обновлена.',
        auction
      });
    } catch (error) {
      console.error("Ошибка при обновлении максимальной ставки:", error.message);
      return res.status(500).json({ message: 'Произошла ошибка при обновлении максимальной ставки.' });
    }
  }
// Новая функция для получения максимальной цены для аукциона по его ID
async getMaxPrice(req, res, next) {
    try {
      const { id } = req.params;
  
      const auction = await Auction.findOne({ where: { id } });
      if (!auction) {
        return res.status(404).json({ message: 'Аукцион не найден.' });
      }
      // Получаем все ставки для данного аукциона
      const bids = await Bid.findAll({ where: { auctionId: id } });
  
      // Если ставок нет, максимальная цена равна стартовой цене
      let maxPrice = auction.startingPrice;
      if (bids && bids.length > 0) {
        maxPrice = Math.max(...bids.map(bid => bid.bidAmount));
      }
  
      return res.status(200).json({ maxPrice });
    } catch (error) {
      console.error("Ошибка при получении максимальной цены:", error.message);
      return res.status(500).json({ message: 'Произошла ошибка при получении максимальной цены.' });
    }
  }
}

module.exports = new AuctionController();
