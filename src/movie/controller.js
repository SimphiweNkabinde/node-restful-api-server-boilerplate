// initialize Knex
import knexConfig from '../../knexfile.js';
import Knex from 'knex';
const knex = Knex(knexConfig);

async function getAll() {
    const movies = await knex
    .select(
        'movies.id', 
        'movies.name', 
        'movies.rating', 
        'movies.explicit', 
        'movies.created_at as createdAt', 
        'movies.updated_at as updatedAt', 
        'genres.id as genreId', 
        'genres.name as genreName')
    .leftJoin('genres', 'movies.genre_id', '=', 'genres.id')
    .from('movies');

    return movies.map(movie => ({
        id: movie.id,
        name: movie.name,
        rating: movie.rating,
        explicit: movie.explicit,
        genre: movie.genreId ? {id: movie.genreId, name: movie.genreName} : null,
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt
    }))

}
async function getOne(id) {
    const movie = await knex
    .select(
        'movies.id', 
        'movies.name', 
        'movies.rating', 
        'movies.explicit', 
        'movies.created_at as createdAt', 
        'movies.updated_at as updatedAt', 
        'genres.id as genreId', 
        'genres.name as genreName')
    .leftJoin('genres', 'movies.genre_id', '=', 'genres.id')
    .from('movies')
    .where({'movies.id': parseInt(id)})
    .first()
    
    if(movie) {
        return ({
            id: movie.id,
            name: movie.name,
            rating: movie.rating,
            explicit: movie.explicit,
            genre: movie.genreId ? {id: movie.genreId, name: movie.genreName} : null,
            createdAt: movie.createdAt,
            updatedAt: movie.updatedAt
        })
    }
    return null
}
function create(movie) {
    movie.genre_id = movie.genre;
    delete movie.genre
    return knex('movies')
    .insert(movie)
    .returning([
        'id', 
        'name', 
        'explicit', 
        'rating', 
        'genre_id as genre', 
        'created_at as createdAt',
        'updated_at as updatedAt'
    ])
}
function update(id, movie) {
    if (movie.genre) {
        movie.genre_id = movie.genre;
        delete movie.genre
    }

    return knex('movies')
    .update(movie)
    .update('updated_at', knex.fn.now())
    .where({ id: parseInt(id)})
    .returning([
        'id', 
        'name', 
        'explicit', 
        'rating', 
        'genre_id as genre', 
        'created_at as createdAt',
        'updated_at as updatedAt'
    ])
}
function remove(id) {
    return knex('movies')
    .del('*')
    .where({id: parseInt(id)})
    .returning([
        'id', 
        'name', 
        'explicit', 
        'rating', 
        'genre_id as genre', 
        'created_at as createdAt',
        'updated_at as updatedAt'
    ])
}

export default {
    getAll,
    getOne,
    create,
    update,
    remove
}