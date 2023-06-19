module.exports = {
  local: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres',
  },
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: process.env.PGSSLMODE,
        rejectUnauthorized: false,
      },
    },
  },
};
