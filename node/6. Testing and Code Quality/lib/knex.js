const config = require('../knexfile');
// If not specified, the default environment is development. Hard-coding.
const knex = require('knex')(config.development);

module.exports = knex;
