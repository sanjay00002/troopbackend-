module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  local: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
  },
};
