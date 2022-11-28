module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {}
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {}
    }
};
