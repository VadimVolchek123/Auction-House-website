require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const sequelize = require('./bd');
const models = require('./model');
const cors = require('cors');
const router = require('./Routes/index')
const errorHandler = require('./middleware/ErrorHandalingMiddleware')
const path = require('path');
require('./scheduler');

const app = express();
const PORT = process.env.PORT || 5000; // Установка порта, на котором будет запущен сервер

app.use(cors()) //Включает поддержку CORS для вашего сервера
app.use(express.json()) //Для работы с json данными
app.use(fileUpload());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();