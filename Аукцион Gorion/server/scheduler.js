const cron = require('node-cron');
const { Auction } = require('./model'); // Проверьте правильность пути
const { Op } = require('sequelize');

// Планируем запуск задачи каждую минуту: '* * * * *'
// Это означает, что проверка будет происходить каждую минуту
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
        auction.status = 'FINISHED'; // Устанавливаем новый статус, например, FINISHED
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