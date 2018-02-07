const knex = require("knex");
const mockKnex = require("mock-knex");

const connection = knex({ client: "mysql", debug: false });
mockKnex.mock(connection, "knex@0.14");

module.exports = connection;
