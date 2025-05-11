const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ Неверный формат токена или отсутствует Authorization заголовок.");
            return res.status(401).json({ message: "Ошибка авторизации" });
        }

        const token = authHeader.split(' ')[1]; // Извлекаем сам токен
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded; // Записываем расшифрованные данные в req.user
        next();
    } catch (error) {
        console.error("❌ Ошибка аутентификации:", error.message);
        return res.status(401).json({ message: "Ошибка авторизации" });
    }
};
