const crypto = require('crypto');
const db = require('./db');
const { check } = require('express-validator');

/**
 * Query the database and check whether the email exists and the password
 * hashes to the correct value.
 * If so, return an object with full user information.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} a Promise that resolves to the full information about the current user, if the password matches
 * @throws the Promise rejects if any errors are encountered
 */

// USER SECTION

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM auth WHERE email = ?';

    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          resolve(false)
        } else {
          const pass = password;
          const salt = row.salt;
          const hashedPassword = crypto.scryptSync(pass, salt, 64).toString('hex');
          if (hashedPassword === row.password) {
            resolve(row);
          } else {
            resolve(false);
          }
        }
      }
    });
  });
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM auth WHERE id = ?`;
    db.get(query, [id], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM auth WHERE email = ?`;
    db.get(query, [email], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}