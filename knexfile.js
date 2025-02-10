import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexConfig = {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
};

export default knexConfig;
