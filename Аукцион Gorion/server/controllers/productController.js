const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo, Seller } = require('../model');
const ApiError = require('../Error/errorApi');

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

    async getAll(req, res) {
        try {
            let { sellerId, typeId, limit, page } = req.query;
            page = parseInt(page, 10) || 1;
            limit = parseInt(limit, 10) || 9;
            const offset = (page - 1) * limit;

            const queryOptions = { limit, offset };

            // Добавляем фильтры
            if (sellerId) queryOptions.where = { sellerId };
            if (typeId) queryOptions.where = { ...queryOptions.where, typeId };

            const products = await Product.findAndCountAll(queryOptions);

            return res.status(200).json(products);
        } catch (error) {
            console.error('Ошибка при получении всех продуктов:', error.message);
            return res.status(500).json({ message: 'Ошибка при получении всех продуктов.' });
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
              // Удаляем "rating" из запрашиваемых атрибутов, т.к. его нет в таблице seller
              { model: Seller, attributes: ['id', 'userId'] },
            ],
          });
      
          console.log(`Найдено продуктов: ${products.count}`);
      
          if (!products.rows.length) {
            return res.status(404).json({ message: 'Продукты для данного продавца не найдены.' });
          }
      
          return res.status(200).json({
            rows: products.rows,
            count: products.count,
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
                    { model: Seller, attributes: ['id', 'userId', 'rating'] },
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
}

module.exports = new ProductController();
