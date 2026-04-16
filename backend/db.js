const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('.env.local')) {
    require('dotenv').config({ path: '.env.local' });
} else {
    require('dotenv').config();
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            connectTimeout: 60000 // 60 seconds
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();

    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

module.exports = { sequelize, connectDB };
