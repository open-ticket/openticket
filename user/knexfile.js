require("dotenv").config();

module.exports = {
  client: "postgresql",
  connection: {
    host: process.env.POSTGRES_HOST || "postgres",
    database: process.env.POSTGRES_DB || "openticket_users",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    port: process.env.POSTGRES_PORT || 5432,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
