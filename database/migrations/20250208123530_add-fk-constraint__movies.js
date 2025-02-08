/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('movies', (table) => {
    table.dropColumn('genre');
    table.integer('genre_id').unsigned();
    table.foreign('genre_id')
    .references('id')
    .inTable('genres')
    .deferrable('deferred')
    .onDelete('SET NULL');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('movies', (table) => {
    table.dropColumn('genre_id');
    table.string('genre');
  })
};
