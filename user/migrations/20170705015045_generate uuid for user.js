/* eslint "func-names": 0 */

exports.up = function(knex) {
  return knex.schema
    .raw('create extension if not exists "uuid-ossp"')
    .alterTable("users", table => {
      table.dropColumn("id");
    })
    .then(() =>
      knex.schema.alterTable("users", table => {
        table
          .uuid("id")
          .notNullable()
          .primary()
          .defaultTo(knex.raw("uuid_generate_v4()"));
      }),
    );
};

exports.down = function(knex) {
  return knex.schema
    .raw('drop extension if exists "uuid-ossp"')
    .alterTable("users", table => {
      table.dropColumn("id");
    })
    .then(() => {
      knex.schema.alterTable("users", table => {
        table
          .uuid("id")
          .notNullable()
          .primary();
      });
    });
};
