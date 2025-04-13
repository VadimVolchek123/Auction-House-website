const sequelize = require('./bd');
const { DataTypes } = require('sequelize');

// Таблица: Пользователь
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true }, // Аватар пользователя
    role: { type: DataTypes.STRING, defaultValue: "USER" }, // Роль: USER или ADMIN
    name: { type: DataTypes.STRING, allowNull: false } // Имя пользователя
});

// Таблица: Продавец
const Seller = sequelize.define('seller', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // S-ID
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } }, // U-ID 
    soldItems: { type: DataTypes.TEXT, allowNull: true } // Список проданных товаров (хранится как текст)
});

// Таблица: Покупатель 
const Buyer = sequelize.define('buyer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // B-ID
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } }, // U-ID 
    bidHistory: { type: DataTypes.TEXT, allowNull: true }, // История заявок (хранится в текстовом формате)
    phone: { type: DataTypes.STRING, allowNull: true } // Изменено: телефон теперь может быть null
});

// Остальные таблицы остаются без изменений
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // I-ID
    sellerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Seller, key: 'id' } }, // S-ID 
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "AVAILABLE" }
});

const Auction = sequelize.define('auction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // A-ID
    itemId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } }, // I-ID 
    description: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "ACTIVE" },
    startingPrice: { type: DataTypes.INTEGER, allowNull: false },
    reservePrice: { type: DataTypes.INTEGER, allowNull: false }
});

const Bid = sequelize.define('bid', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } }, // U-ID 
    auctionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Auction, key: 'id' } }, // A-ID 
    bidAmount: { type: DataTypes.INTEGER, allowNull: false }
});

const SellerReview = sequelize.define('seller_review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sellerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Seller, key: 'id' } }, // S-ID 
    reviewText: { type: DataTypes.TEXT, allowNull: true },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

const ProductInfo = sequelize.define('product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    main_info: { type: DataTypes.STRING, allowNull: false, validate: { len: [1, 255] } },
    secondary_info: { type: DataTypes.TEXT, allowNull: true }
});

// Связи между таблицами
User.hasOne(Buyer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Buyer.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Seller, { foreignKey: 'userId', onDelete: 'CASCADE' });
Seller.belongsTo(User, { foreignKey: 'userId' });

Seller.hasMany(SellerReview, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
SellerReview.belongsTo(Seller, { foreignKey: 'sellerId' });

Seller.hasMany(Product, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

Product.hasOne(Auction, { foreignKey: 'productId', onDelete: 'CASCADE' });
Auction.belongsTo(Product, { foreignKey: 'productId' });

Auction.hasMany(Bid, { foreignKey: 'auctionId', onDelete: 'CASCADE' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId' });

User.hasMany(Bid, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bid.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(ProductInfo, { foreignKey: 'productId', as: 'info', onDelete: 'CASCADE' });
ProductInfo.belongsTo(Product, { foreignKey: 'productId' });

Type.hasMany(Product, { foreignKey: 'typeId', onDelete: 'CASCADE' });
Product.belongsTo(Type, { foreignKey: 'typeId' });

module.exports = {
    User,
    Buyer,
    Seller,
    SellerReview,
    Product,
    Type,
    ProductInfo,
    Auction,
    Bid
};
