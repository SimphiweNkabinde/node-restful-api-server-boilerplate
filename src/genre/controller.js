// initialize Knex
import knexConfig from '../../knexfile.js';
import Knex from 'knex';
const knex = Knex(knexConfig);

function getAll() {
    return knex('genres')
        .select(
            'id',
            'name',
            'created_at as createdAt',
            'updated_at as updatedAt',
        );
}
function getOne(id) {
    return knex('genres')
        .select(
            'id',
            'name',
            'created_at as createdAt',
            'updated_at as updatedAt',
        )
        .where({ id: parseInt(id) });
}
function create(genre) {
    return knex('genres')
        .insert(genre)
        .returning([
            'id',
            'name',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]);
}
function update(id, genre) {
    return knex('genres')
        .update(genre)
        .update('updated_at', knex.fn.now())
        .where({ id: parseInt(id) })
        .returning([
            'id',
            'name',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]);
}
function remove(id) {
    return knex('genres')
        .del('*')
        .where({ id: parseInt(id) })
        .returning([
            'id',
            'name',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]);;
}

export default {
    getAll,
    getOne,
    create,
    update,
    remove,
};
