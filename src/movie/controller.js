// initialize Knex
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

function getAll() {
    return knex('movies')
    .select('*');
}
function getOne(id) {
    return knex('movies')
    .select().where({id: parseInt(id)})
}
function create(movie) {
    return knex('movies')
    .insert(movie, '*')
}
function update(id, movie) {
    return knex('movies')
    .update(movie)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id)})
    .returning('*')
}
function remove(id) {
    return knex('movies')
    .del('*')
    .where({id: parseInt(id)})
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}