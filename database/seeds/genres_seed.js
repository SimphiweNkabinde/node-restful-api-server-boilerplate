/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('genres').del()
  await knex('genres').insert([
    { name: 'fantasy'},
    { name: 'horror'},
    { name: 'action'},
    { name: 'sci-fi'},
    { name: 'suspense'},
    { name: 'romance'},
  ]);
};
