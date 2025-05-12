const { Cart, Buyer, Auction, Product } = require('../model');
const ApiError = require('../Error/errorApi');

class CartController {
  
    // Получение товаров в корзине
    async getCart(req, res, next) {
        try {
          const buyerId = req.user.buyerId;
      
          const cartItems = await Cart.findAll({
            where: { buyerId },
            include: [
              {
                model: Auction,
                include: [
                  {
                    model: Product
                  }
                ]
              }
            ]
          });
      
          return res.status(200).json({ cart: cartItems });
        } catch (error) {
          console.error('Ошибка при получении корзины:', error);
          next(ApiError.internal('Ошибка при получении корзины.'));
        }
    }

    // Добавление товара (аукциона) в корзину
    async addToCart(req, res, next) {
      try {
        const buyerId = req.user.buyerId;
        const { auctionId, totalAmount } = req.body;

        if (!auctionId || !totalAmount || totalAmount <= 0) {
          return next(ApiError.badRequest('Некорректные данные.'));
        }

        const auction = await Auction.findOne({ where: { id: auctionId } });
        if (!auction) {
          return next(ApiError.badRequest('Аукцион не найден.'));
        }

        await Cart.create({ buyerId, auctionId, totalAmount });

        return res.status(201).json({ message: 'Товар добавлен в корзину.' });
      } catch (error) {
        console.error('Ошибка при добавлении товара в корзину:', error);
        next(ApiError.internal('Ошибка при добавлении товара.'));
      }
    }

    // Удаление товара из корзины
    async removeFromCart(req, res, next) {
      try {
        const buyerId = req.user.buyerId;
        const { cartItemId } = req.params;

        const cartItem = await Cart.findOne({ where: { id: cartItemId, buyerId } });
        if (!cartItem) {
          return next(ApiError.badRequest('Товар в корзине не найден.'));
        }

        await cartItem.destroy();
        return res.status(200).json({ message: 'Товар удалён из корзины.' });
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        next(ApiError.internal('Ошибка при удалении товара.'));
      }
    }

    // Очистка корзины пользователя
    async clearCart(req, res, next) {
      try {
        const buyerId = req.user.buyerId;

        await Cart.destroy({ where: { buyerId } });
        return res.status(200).json({ message: 'Корзина очищена.' });
      } catch (error) {
        console.error('Ошибка при очистке корзины:', error);
        next(ApiError.internal('Ошибка при очистке корзины.'));
      }
    }

    // Оплата товаров в корзине
    async payForCart(req, res, next) {
      try {
        const buyerId = req.user.buyerId;

        // Получаем товары, ожидающие оплаты
        const cartItems = await Cart.findAll({ where: { buyerId, paymentStatus: "pending" } });

        if (!cartItems || cartItems.length === 0) {
          return next(ApiError.badRequest("Нет товаров, ожидающих оплаты."));
        }

        // Получаем текущий баланс покупателя
        const buyer = await Buyer.findOne({ where: { id: buyerId } });
        if (!buyer) {
          return next(ApiError.badRequest("Покупатель не найден."));
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

        if (buyer.balance < totalPrice) {
          return next(ApiError.badRequest("Недостаточно средств для оплаты."));
        }

        // Вычитаем сумму из баланса покупателя
        buyer.balance -= totalPrice;
        await buyer.save();

        // Обновляем статус оплаты в корзине
        await Cart.update(
          { paymentStatus: "paid" },
          { where: { buyerId, paymentStatus: "pending" } }
        );

        return res.status(200).json({ message: `Оплата прошла успешно. Остаток: ${buyer.balance} руб.`, balance: buyer.balance });
      } catch (error) {
        console.error("Ошибка при оплате товаров:", error);
        next(ApiError.internal("Ошибка при оплате."));
      }
    }
}

module.exports = new CartController();