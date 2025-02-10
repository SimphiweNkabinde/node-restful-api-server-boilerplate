/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('genres').del();
    await knex('genres').insert([
        { name: 'fantasy' },
        { name: 'science fiction' },
        { name: 'action' },
    ]);
};
