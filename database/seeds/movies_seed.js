/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('movies').del()
  await knex('movies').insert([
    { name: 'The Land Before Time', genre: 'Fantasy', rating: 7, explicit: false },
    { name: 'Jurassic Park', genre: 'Science Fiction', rating: 9, explicit: true },
    { name: 'Ice Age: Dawn of the Dinosaur', genre: 'Action/Romance', rating: 5, explicit: false }
  ]);
};
