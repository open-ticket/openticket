/* eslint "func-names": 0 */

exports.up = function(knex) {
  return knex.schema.alterTable("users", table => {
    table.unique("email");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("users", table => {
    table.dropUnique("email");
  });
};
