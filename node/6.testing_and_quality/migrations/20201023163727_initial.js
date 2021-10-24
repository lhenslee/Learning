module.exports.up = knex => knex.schema.createTable('reservations', table => {
  table.increments('id').unsigned().primary();
  table.dateTime('datetime').notNullable();
  table.specificType('party', 'TINYINT').notNullable();
  table.string('name').notNullable();
  table.string('email').notNullable();
  table.string('phone');
  table.text('message');
});

module.exports.down = knex => knex.schema.dropTable('reservations');
