/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('movies').del();
    await knex('movies').insert([
        { name: 'The Land Before Time', genre_id: 1, rating: 7, explicit: false },
        { name: 'Jurassic Park', genre_id: 2, rating: 9, explicit: true },
        { name: 'Ice Age: Dawn of the Dinosaur', genre_id: 3, rating: 5, explicit: false },
    ]);
};
