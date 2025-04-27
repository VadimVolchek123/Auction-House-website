const sequelize = require('./bd');
const { DataTypes } = require('sequelize');

// Таблица: Пользователь
const User = sequelize.define('user', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    avatar: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    role: { 
        type: DataTypes.STRING, 
        defaultValue: "USER" 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    // Новые поля для хранения идентификаторов покупателя и продавца:
    buyerId: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        // Если таблица с покупателями называется 'buyers'
        references: { model: 'buyers', key: 'id' }
    },
    sellerId: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        // Если таблица с продавцами называется 'sellers'
        references: { model: 'sellers', key: 'id' }
    }
});

// Таблица: Продавец
const Seller = sequelize.define('seller', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' } 
    },
    soldItems: { type: DataTypes.TEXT, allowNull: true }
});

// Таблица: Покупатель 
const Buyer = sequelize.define('buyer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' } 
    },
    bidHistory: { type: DataTypes.TEXT, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true }
});

// Таблица: Тип продукта
const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

// Таблица: Продукт
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sellerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Seller, key: 'id' } 
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Type, key: 'id' }
    },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "AVAILABLE" },
    img: { type: DataTypes.STRING, allowNull: true }
});

// Таблица: Аукцион
const Auction = sequelize.define('auction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Product, key: 'id' }
    },
    description: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "ACTIVE" },
    startingPrice: { type: DataTypes.INTEGER, allowNull: false },
    reservePrice: { type: DataTypes.INTEGER, allowNull: false }
});

// Таблица: Ставка
const Bid = sequelize.define('bid', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: 'id' } 
    },
    auctionId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Auction, key: 'id' } 
    },
    bidAmount: { type: DataTypes.INTEGER, allowNull: false }
});

// Таблица: Отзыв о продавце
const SellerReview = sequelize.define('seller_review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sellerId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Seller, key: 'id' } 
    },
    reviewText: { type: DataTypes.TEXT, allowNull: true },
    rating: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        validate: { min: 1, max: 5 } 
    }
});

// Таблица: Дополнительная информация о продукте
const ProductInfo = sequelize.define('product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: Product, key: 'id' } 
    },
    main_info: { type: DataTypes.STRING, allowNull: false, validate: { len: [1, 255] } },
    secondary_info: { type: DataTypes.TEXT, allowNull: true }
});

// Связи между таблицами
User.belongsTo(Buyer, { foreignKey: 'buyerId', as: 'buyerProfile' });
User.belongsTo(Seller, { foreignKey: 'sellerId', as: 'sellerProfile' });
// User - Buyer
User.hasOne(Buyer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Buyer.belongsTo(User, { foreignKey: 'userId' });

// User - Seller
User.hasOne(Seller, { foreignKey: 'userId', onDelete: 'CASCADE' });
Seller.belongsTo(User, { foreignKey: 'userId' });

// Seller - SellerReview
Seller.hasMany(SellerReview, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
SellerReview.belongsTo(Seller, { foreignKey: 'sellerId' });

// Seller - Product
Seller.hasMany(Product, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

// Type - Product
Type.hasMany(Product, { foreignKey: 'typeId', onDelete: 'CASCADE' });
Product.belongsTo(Type, { foreignKey: 'typeId' });

// Product - Auction
Product.hasOne(Auction, { foreignKey: 'productId', onDelete: 'CASCADE' });
Auction.belongsTo(Product, { foreignKey: 'productId' });

// Auction - Bid
Auction.hasMany(Bid, { foreignKey: 'auctionId', onDelete: 'CASCADE' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId' });

// User - Bid
User.hasMany(Bid, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bid.belongsTo(User, { foreignKey: 'userId' });

// Product - ProductInfo
Product.hasMany(ProductInfo, { foreignKey: 'productId', as: 'info', onDelete: 'CASCADE' });
ProductInfo.belongsTo(Product, { foreignKey: 'productId' });

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