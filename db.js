const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const db = {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    })
  }
}

module.exports = db;
