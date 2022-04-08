const knexConfig = require('../../knexfile');
import { knex } from 'knex';

export const db = knex(knexConfig);
