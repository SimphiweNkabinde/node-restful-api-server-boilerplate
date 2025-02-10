/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable('movies', (table) => {
        table.increments();
        table.string('name').notNullable().unique();
        table.string('genre');
        table.integer('rating');
        table.boolean('explicit');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable('movies');
};
