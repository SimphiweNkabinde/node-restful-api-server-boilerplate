// initialize Knex
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

function getAll() {
    return knex('genres')
    .select('*');
}
function getOne(id) {
    return knex('genres')
    .select().where({id: parseInt(id)})
}
function create(genre) {
    return knex('genres')
    .insert(genre, '*')
}
function update(id, genre) {
    return knex('genres')
    .update(genre)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id)})
    .returning('*')
}
function remove(id) {
    return knex('genres')
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