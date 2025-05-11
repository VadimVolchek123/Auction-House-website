const cron = require('node-cron');
const { Auction, Bid, Cart } = require('./model'); // Проверьте, что здесь Cart не undefined
const { Op } = require('sequelize');

// Запуск проверки каждую минуту
cron.schedule('* * * * *', async () => {
  console.log('Проверка истекших аукционов...');
  try {
    const now = new Date();

    // Находим все активные аукционы, у которых время окончания прошло
    const expiredAuctions = await Auction.findAll({
      where: {
        endTime: { [Op.lt]: now },
        status: 'ACTIVE'
      }
    });

    if (expiredAuctions.length > 0) {
      for (const auction of expiredAuctions) {
        // Получаем самую высокую ставку
        const highestBid = await Bid.findOne({
          where: { id: auction.highestBidId }
        });

        if (highestBid) {
          // Если модель Cart определена, добавляем запись
          await Cart.create({
            buyerId: highestBid.userId, // Победитель
            auctionId: auction.id, // Завершённый аукцион
            totalAmount: highestBid.bidAmount // Сумма сделки
          });
          console.log(`Аукцион ${auction.id}: товар куплен пользователем ${highestBid.userId} за ${highestBid.bidAmount} руб.`);
        } else {
          console.log(`Аукцион ${auction.id} завершён без ставок.`);
        }

        // Обновляем статус аукциона
        auction.status = 'FINISHED';
        await auction.save();
      }
      console.log(`Обновлено ${expiredAuctions.length} аукционов до статуса FINISHED.`);
    } else {
      console.log('Нет истекших аукционов для обновления.');
    }
  } catch (error) {
    console.error('Ошибка при проверке аукционов:', error.message);
  }
});
