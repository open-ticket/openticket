/* eslint "func-names": 0 */

exports.up = function(knex) {
  return knex.schema.table("users", table => {
    table.boolean("isDeleted").defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table("users", table => {
    table.dropColumn("isDeleted");
  });
};
