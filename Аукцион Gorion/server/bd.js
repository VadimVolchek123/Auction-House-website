const {Sequelize} = require('sequelize'); 

module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: './db auction.db'
})