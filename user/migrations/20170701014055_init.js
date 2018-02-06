/* eslint "func-names": 0 */

exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table
      .uuid("id")
      .notNullable()
      .primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
