const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo, Seller, Auction } = require('../model');
const ApiError = require('../Error/errorApi');
const { Op } = require('sequelize');

class ProductController {

    async create(req, res, next) {
        try {
            const { name, description, status, sellerId, typeId, info } = req.body;
            const { img } = req.files;

            // Проверка обязательных полей
            if (!name || !description || !sellerId || !typeId || !img) {
                return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
            }

            // Генерация уникального имени файла для изображения
            const fileName = uuid.v4() + ".jpg";
            await img.mv(path.resolve(__dirname, '..', 'static', fileName)); // Сохранение файла

            // Создание продукта
            const product = await Product.create({
                name,
                description,
                status: status || 'AVAILABLE',
                sellerId,
                typeId,
                img: fileName,
                // Для корректной работы getMaxPrice предполагается наличие поля price!
                // Если его нет, необходимо его добавить в модель и в запросе.
                price: req.body.price || 0
            });

            // Обработка дополнительной информации (info)
            if (info) {
                const parsedInfo = JSON.parse(info); // Парсинг строки JSON
                parsedInfo.forEach(async (item) => {
                    await ProductInfo.create({
                        main_info: item.main_info,
                        secondary_info: item.secondary_info,
                        productId: product.id,
                    });
                });
            }

            return res.status(201).json(product);
        } catch (error) {
            console.error('Ошибка при создании продукта:', error.message);
            next(ApiError.badRequest('Ошибка при создании продукта.'));
        }
    }

    async getAll(req, res, next) {
      try {
        // Извлекаем параметры запроса
        let { sellerId, typeId, limit, page, search } = req.query;
    
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 9;
        const offset = (page - 1) * limit;
    
        // Формируем базовые параметры запроса для пагинации
        const queryOptions = { limit, offset, where: {} };
    
        // Фильтр по sellerId
        if (sellerId) {
          queryOptions.where.sellerId = sellerId;
        }
    
        // Фильтр по typeId
        if (typeId) {
          queryOptions.where.typeId = typeId;
        }
    
        // Фильтр по имени товара (поисковый запрос)
        if (search) {
          queryOptions.where.name = { [Op.like]: `%${search}%` };
        }
    
        // Включаем связанные аукционы — только активные (где endTime больше текущего времени)
        const now = new Date();
        queryOptions.include = [
          {
            model: Auction,
            required: true, // возвращаем только товары, у которых есть связанный аукцион
            where: {
              endTime: { [Op.gt]: now }
            }
          }
        ];
    
        const products = await Product.findAndCountAll(queryOptions);
    
        return res.status(200).json(products);
      } catch (error) {
        console.error("Ошибка при получении всех продуктов:", error.message);
        return res.status(500).json({ message: "Ошибка при получении всех продуктов." });
      }
    }
 
    async getAllBySeller(req, res, next) {
      try {
        // Приводим sellerId к числу и проверяем корректность
        const sellerId = parseInt(req.params.sellerId, 10);
        if (isNaN(sellerId)) {
          return next(ApiError.badRequest('ID продавца указан некорректно.'));
        }
    
        // Извлекаем параметры пагинации и приводим их к числовому значению
        let { page, limit } = req.query;
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 9;
        const offset = (page - 1) * limit;
    
        console.log(`Запрос продуктов для sellerId: ${sellerId}, page: ${page}, limit: ${limit}`);
    
        // Выполняем запрос с пагинацией, включая связанные модели
        const products = await Product.findAndCountAll({
          where: { sellerId },
          limit,
          offset,
          include: [
            { model: ProductInfo, as: 'info' },
            // Указываем необходимые атрибуты для продавца
            { model: Seller, attributes: ['id', 'userId'] },
          ],
        });
    
        console.log(`Найдено продуктов: ${products.count}`);
    
        // Возвращаем всегда ответ с 200, даже если продуктов нет
        return res.status(200).json({
          rows: products.rows || [],
          count: products.count || 0,
        });
      } catch (error) {
        console.error('Ошибка при получении продуктов продавца:', error.message);
        console.error(error.stack);
        return next(ApiError.internal('Ошибка при получении продуктов продавца.'));
      }
    }
      
      async getOne(req, res, next) {
        try {
          const { id } = req.params;
      
          const product = await Product.findOne({
            where: { id },
            include: [
              { model: ProductInfo, as: 'info' },
              { model: Seller, attributes: ['id', 'userId'] } // removed 'rating'
            ],
          });
      
          if (!product) {
            return next(ApiError.badRequest('Продукт не найден.'));
          }
      
          return res.status(200).json(product);
        } catch (error) {
          console.error('Ошибка при получении продукта:', error.message);
          next(ApiError.internal('Ошибка при получении продукта.'));
        }
      }
      

    // Новый метод для получения максимальной цены среди продуктов
    async getMaxPrice(req, res, next) {
        try {
            // Предполагаем, что в модели Product есть столбец "price"
            const maxPrice = await Product.max('price');
            return res.status(200).json({ maxPrice });
        } catch (error) {
            console.error("Ошибка при получении максимальной цены:", error.message);
            return next(ApiError.internal('Ошибка при получении максимальной цены.'));
        }
    }
    // Если для продукта найдены связанные аукционы, они удаляются перед удалением продукта.
    async deleteProduct(req, res, next) {
      try {
          const { id } = req.params;
          
          // Найти продукт по id
          const product = await Product.findOne({ where: { id } });
          if (!product) {
              return next(ApiError.badRequest('Продукт не найден.'));
          }
          
          // Проверить наличие связанных аукционов по productId
          const associatedAuctions = await Auction.findAll({ where: { productId: id } });
          
          // Если найдены связанные аукционы, удалить их
          if (associatedAuctions && associatedAuctions.length > 0) {
              await Auction.destroy({ where: { productId: id } });
          }
          
          // Удалить продукт
          await product.destroy();
          
          return res.status(200).json({ message: 'Продукт и связанные аукционы успешно удалены.' });
      } catch (error) {
          console.error('Ошибка при удалении продукта:', error.message);
          next(ApiError.internal('Ошибка при удалении продукта.'));
      }
  }
}

module.exports = new ProductController();
