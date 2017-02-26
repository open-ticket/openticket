exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('user', function (table) {

        })
    ]);
};

exports.down = function(knex, Promise) {

};
