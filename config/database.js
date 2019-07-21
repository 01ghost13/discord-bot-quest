module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        ssl: true,
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        }
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        }
    }
};
