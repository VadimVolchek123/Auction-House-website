const ApiError = require('../Error/errorApi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Buyer, Seller } = require('../model'); // Подключаем актуальные модели


// Функция для генерации JWT токена
const generateJwt = (id, email, role, name) => {
    return jwt.sign(
        { id, email, role, name },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    // Получение профиля пользователя
    async profile(req, res, next) {
        try {
            const userId = req.user.id; // ID пользователя из токена

            const user = await User.findOne({
                where: { id: userId },
                attributes: ['id', 'email', 'name', 'avatar', 'role'], // Теперь role включено
            });

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден.'));
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error('Ошибка при получении профиля пользователя:', error);
            next(ApiError.internal('Ошибка при получении профиля пользователя.'));
        }
    }

    // Обновление данных пользователя
    async update(req, res, next) {
        try {
            const userId = req.user.id; // ID текущего пользователя
            const { email, password, name, avatar } = req.body; // Поля для изменения

            if (!email && !password && !name && !avatar) {
                return next(ApiError.badRequest('Не передано ни одно поле для изменения.'));
            }

            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден.'));
            }

            if (email) user.email = email;
            if (name) user.name = name;
            if (avatar) user.avatar = avatar;
            if (password) {
                const hashPassword = await bcrypt.hash(password, 5);
                user.password = hashPassword;
            }

            await user.save();

            return res.status(200).json({ message: 'Профиль обновлён.', user });
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            next(ApiError.internal('Ошибка при обновлении профиля.'));
        }
    }

    // Регистрация нового пользователя
    async registration(req, res, next) {
        try {
            const { email, password, role = 'ADMIN', name } = req.body; // Роль по умолчанию — USER
    
            if (!email || !password || !name) {
                return next(ApiError.badRequest('Некорректные данные (email, имя или пароль).'));
            }
    
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует.'));
            }
    
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, role, name });
    
            // Независимо от роли, создаём записи для покупателя и продавца
            await Buyer.create({ userId: user.id, phone: null });
            await Seller.create({ userId: user.id, soldItems: null });
    
            const token = generateJwt(user.id, user.email, user.role, user.name);
    
            return res.status(201).json({ token, message: `Пользователь зарегистрирован с ролью ${role}.` });
        } catch (error) {
            console.error('Ошибка при регистрации пользователя:', error);
            next(ApiError.internal('Ошибка при регистрации.'));
        }
    }
    

    // Авторизация пользователя
    async login(req, res, next) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден.'));
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверный пароль.'));
        }

        const token = generateJwt(user.id, user.email, user.role, user.name);
        return res.status(200).json({ token });
    }

    // Проверка авторизации (получение нового токена)
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name);
        return res.status(200).json({ token });
    }

    // Получение данных покупателя
    async getBuyerInfo(req, res, next) {
        try {
            const userId = req.params.id;
            const buyer = await Buyer.findOne({ where: { userId } });
            if (!buyer) {
                return next(ApiError.badRequest('Покупатель не найден.'));
            }
            return res.status(200).json(buyer);
        } catch (error) {
            console.error('Ошибка при получении данных покупателя:', error);
            next(ApiError.internal('Ошибка при получении данных покупателя.'));
        }
    }

    // Получение данных продавца
    async getSellerInfo(req, res, next) {
        try {
            const userId = req.params.id;
            const seller = await Seller.findOne({ where: { userId } });
            if (!seller) {
                return next(ApiError.badRequest('Продавец не найден.'));
            }
            return res.status(200).json(seller);
        } catch (error) {
            console.error('Ошибка при получении данных продавца:', error);
            next(ApiError.internal('Ошибка при получении данных продавца.'));
        }
    }
}

module.exports = new UserController();
