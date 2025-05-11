const ApiError = require('../Error/errorApi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Buyer, Seller } = require('../model'); // Подключаем актуальные модели
const uuid = require('uuid');
const path = require('path');

// Функция генерации JWT токена с расширенным payload
const generateJwt = (id, email, role, name, buyerId, sellerId) => {
  return jwt.sign(
    { id, email, role, name, buyerId, sellerId },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  // Получение профиля пользователя с дополнительными полями (buyerId, sellerId)
  async profile(req, res, next) {
    try {
      const userId = req.user.id; // Получаем ID пользователя из токена

      const user = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'name', 'avatar', 'role', 'buyerId', 'sellerId']
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
      const userId = req.user.id;
      const { email, password, name, avatar } = req.body;
  
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден.'));
      }
  
      if (email) user.email = email;
      if (name) user.name = name;
  
      // Если передан файл для аватара, сохраняем его в static
      if (req.files && req.files.avatar) {
        const fileName = uuid.v4() + ".jpg";
        await req.files.avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
        user.avatar = fileName;
      } else if (avatar) {
        // Если файл не передан, но есть значение avatar в теле запроса, обновляем его
        user.avatar = avatar;
      }
  
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

  // Регистрация нового пользователя с сохранением buyerId и sellerId
  async registration(req, res, next) {
    try {
      const { email, password, role = 'USER', name } = req.body;

      if (!email || !password || !name) {
        return next(ApiError.badRequest('Некорректные данные (email, имя или пароль).'));
      }

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует.'));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      // Создаем пользователя (на данном этапе buyerId и sellerId отсутствуют)
      let user = await User.create({ email, password: hashPassword, role, name });

      // Создаем записи для покупателя и продавца
      const buyerRecord = await Buyer.create({ userId: user.id, phone: null });
      const sellerRecord = await Seller.create({ userId: user.id, soldItems: null });

      // Обновляем пользователя с полученными идентификаторами
      user.buyerId = buyerRecord.id;
      user.sellerId = sellerRecord.id;
      await user.save();

      // Генерируем токен, передавая расширенный payload
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.name,
        user.buyerId,
        user.sellerId
      );

      return res.status(201).json({ 
        token, 
        message: `Пользователь зарегистрирован с ролью ${role}.`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          buyerId: user.buyerId,
          sellerId: user.sellerId
        }
      });
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      next(ApiError.internal('Ошибка при регистрации.'));
    }
  }

  // Авторизация пользователя
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password', 'role', 'name', 'buyerId', 'sellerId']
      });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден.'));
      }

      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest('Неверный пароль.'));
      }

      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.name,
        user.buyerId,
        user.sellerId
      );
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Ошибка при авторизации пользователя:', error);
      next(ApiError.internal('Ошибка при авторизации.'));
    }
  }

  // Проверка авторизации (обновление токена)
  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.email,
        req.user.role,
        req.user.name,
        req.user.buyerId,
        req.user.sellerId
      );
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
      next(ApiError.internal('Ошибка при проверке авторизации.'));
    }
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

  // Получение списка всех пользователей (админ панель)
  async getAllUsers(req, res, next) {
    try {
      // Можно добавить пагинацию, фильтрацию и выбор полей по необходимости
      const users = await User.findAll({
        attributes: ['id', 'email', 'name', 'role', 'buyerId', 'sellerId']
      });
      return res.status(200).json({ users });
    } catch (error) {
      console.error('Ошибка при получении всех пользователей:', error);
      next(ApiError.internal('Ошибка при получении пользователей.'));
    }
  }

  // Удаление пользователя по ID (админ панель)
  async removeUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден.'));
      }
      // При необходимости сначала удаляем связанные записи в Buyer и Seller
      await Buyer.destroy({ where: { userId } });
      await Seller.destroy({ where: { userId } });

      await User.destroy({ where: { id: userId } });
      return res.status(200).json({ message: 'Пользователь удалён.' });
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      next(ApiError.internal('Ошибка при удалении пользователя.'));
    }
  }

async updateUserRole(req, res, next) {
  try {
    // Проверяем, что текущий пользователь — администратор
    if (req.user.role !== 'ADMIN') {
      return next(ApiError.forbidden('Доступ запрещён. Только администратор может изменять роли.'));
    }

    // Извлекаем userId пользователя, чья роль будет обновлена, и новую роль из тела запроса
    const { userId, role } = req.body;
    if (!userId || !role) {
      return next(ApiError.badRequest('Необходимо указать идентификатор пользователя и новую роль.'));
    }

    const userToUpdate = await User.findOne({ where: { id: userId } });
    if (!userToUpdate) {
      return next(ApiError.badRequest('Пользователь не найден.'));
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    return res.status(200).json({
      message: 'Роль обновлена',
      user: userToUpdate
    });
  } catch (error) {
    console.error('Ошибка при обновлении роли пользователя:', error);
    next(ApiError.internal('Ошибка при обновлении роли пользователя.'));
  }
}
}
module.exports = new UserController();
