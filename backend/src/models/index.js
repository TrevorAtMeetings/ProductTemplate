const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    schema: 'ecommerce',
    define: {
      schema: 'ecommerce',
    }
  }
);

// Create schema if it doesn't exist
sequelize.beforeConnect(async (config) => {
  const tempSequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      dialect: 'postgres',
      logging: false
    }
  );

  try {
    await tempSequelize.query('CREATE SCHEMA IF NOT EXISTS ecommerce;');
    await tempSequelize.close();
  } catch (error) {
    console.error('Error creating schema:', error);
  }
});

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize),
  Product: require('./product')(sequelize, Sequelize),
};

// Define associations if needed
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db; 