// initialize Knex
import knexConfig from '../../knexfile.js';
import Knex from 'knex';
const knex = Knex(knexConfig);

function getAll() {
    return knex('genres')
        .select('*');
}
function getOne(id) {
    return knex('genres')
        .select().where({ id: parseInt(id) });
}
function create(genre) {
    return knex('genres')
        .insert(genre, '*');
}
function update(id, genre) {
    return knex('genres')
        .update(genre)
        .update('updated_at', knex.fn.now())
        .where({ id: parseInt(id) })
        .returning('*');
}
function remove(id) {
    return knex('genres')
        .del('*')
        .where({ id: parseInt(id) });
}

export default {
    getAll,
    getOne,
    create,
    update,
    remove,
};
