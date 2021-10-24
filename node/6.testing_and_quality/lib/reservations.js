const _ = require('lodash');
const knex = require('./knex');
const debug = require('debug')('nadia:lib:reservations');

/**
 * Retrieve reservations.
 *
 * @return {Promise<Array>} Reservations.
 */
function fetch() {
  return knex.select().table('reservations');
}

/**
 * Create a reservation; performs validation.
 *
 * @param {Reservation} reservation - a new reservation request.
 * @return {Promise<number>} Newly created reservation ID.
 */
function create(reservation) {
  return validate(reservation)
    .then(save)
    .then(result => result[0])
}

/**
 * Save a reservation to the database.
 *
 * @param {Reservation} reservation - A reservation request.
 * @return {Promise<Array>} Insert ID.
 */
function save(reservation) {
  debug(`Saving ${JSON.stringify(reservation)}`);
  return knex('reservations').insert(reservation);
}

/**
 * Validate a reservation.
 *
 * @param {Reservation} reservation - A reservation request.
 * @return {Promise<Reservation>} Validated reservation.
 */
function validate(reservation) {
  debug(`Validating ${JSON.stringify(reservation)}`);
  return new Promise((resolve, reject) => {
    reservation.validate((error, value) => {
      if (error) {
        return reject(error);
      }
      return resolve(value);
    });
  });
}

module.exports = {
  create,
  fetch,
  save,
  validate
}
