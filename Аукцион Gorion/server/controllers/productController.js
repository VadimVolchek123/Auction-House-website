const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo, Seller } = require('../model');
const ApiError = require('../Error/errorApi');

class ProductController {
    // Создание продукта
    async create(req, res, next) {
        try {
            let { name, description, status, sellerId, typeId, info } = req.body; 
            const { img } = req.files;

            // Проверка обязательных полей
            if (!name || !description || !sellerId || !typeId || !img) {
                return next(ApiError.badRequest('Все обязательные поля должны быть заполнены.'));
            }

            // Генерация уникального имени файла для изображения
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName)); // Сохранение файла

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
                info = JSON.parse(info); 
                info.forEach(i => 
                    ProductInfo.create({
                        main_info: i.main_info,
                        secondary_info: i.secondary_info,
                        productId: product.id,
                    })
                );
            }

            return res.status(201).json(product);
        } catch (e) {
            console.error('Ошибка при создании продукта:', e.message);
            next(ApiError.badRequest('Ошибка при создании продукта.'));
        }
    }

    // Получение всех продуктов
    async getAll(req, res) {
        try {
            let { sellerId, typeId, limit, page } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;

            let queryOptions = { limit, offset };

            // Добавляем фильтры в зависимости от наличия sellerId и typeId
            if (sellerId) queryOptions.where = { sellerId };
            if (typeId) queryOptions.where = { ...queryOptions.where, typeId };

            const products = await Product.findAndCountAll(queryOptions);

            return res.status(200).json(products);
        } catch (e) {
            console.error('Ошибка при получении всех продуктов:', e.message);
            return res.status(500).json({ message: 'Ошибка при получении всех продуктов.' });
        }
    }

    // Получение всех продуктов конкретного продавца
    async getAllBySeller(req, res, next) {
        try {
            const { sellerId } = req.params;

            // Проверка: передан ли sellerId
            if (!sellerId) {
                return next(ApiError.badRequest('ID продавца не указан.'));
            }

            // Получение продуктов, связанных с конкретным продавцом
            const products = await Product.findAll({
                where: { sellerId },
                include: [
                    { model: ProductInfo, as: 'info' }, // Информация о продукте
                    { model: Seller, attributes: ['id', 'userId', 'rating'] }, // Информация о продавце
                ],
            });

            if (!products.length) {
                return res.status(404).json({ message: 'Продукты для данного продавца не найдены.' });
            }

            return res.status(200).json(products);
        } catch (e) {
            console.error('Ошибка при получении продуктов продавца:', e.message);
            next(ApiError.internal('Ошибка при получении продуктов продавца.'));
        }
    }

    // Получение одного продукта
    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            // Поиск продукта
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
        } catch (e) {
            console.error('Ошибка при получении продукта:', e.message);
            next(ApiError.internal('Ошибка при получении продукта.'));
        }
    }
}

module.exports = new ProductController();
