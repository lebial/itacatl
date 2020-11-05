const{ Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on('connect', () => console.log('conected to the db'));

const createUsersTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS users(
    id_user SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP
  );`;
    const response = await pool.query(createTableText);
    console.log(response);
};

const createBusinessTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS business(
    id_business SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    days_not_in_service TEXT ARRAY,
    location TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP
  );`;
    const response = await pool.query(createTableText);
    console.log(response);
}

const createDriversTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS drivers(
    id_driver SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    licence_number TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL
  );`;
  const response = await pool.query(createTableText);
  console.log(response);
}

const createItemsTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS items(
    id_item SERIAL PRIMARY KEY,
    id_business INT,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(5,2) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_business
      FOREIGN KEY(id_business)
        REFERENCES business(id_business)
        ON DELETE CASCADE
  );`;
  const response = await pool.query(createTableText);
  console.log(response);
}

const createOrdersTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS orders(
    id_order SERIAL PRIMARY KEY,
    id_user INT,
    id_business INT,
    id_driver INT,
    comments TEXT,
    delivery_location TEXT NOT NULL,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'undelivered',
    CONSTRAINT fk_user
      FOREIGN KEY(id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE,
    CONSTRAINT fk_business
      FOREIGN KEY(id_business)
        REFERENCES business(id_business)
        ON DELETE CASCADE,
    CONSTRAINT fk_driver
      FOREIGN KEY(id_driver)
      REFERENCES drivers(id_driver)
      ON DELETE CASCADE);`;
  const response = await pool.query(createTableText);
  console.log(response);
}

const createOrdersItemsTable = async () => {
  const createTableText = `CREATE TABLE IF NOT EXISTS orders_items(
    id_order INT,
    id_item INT,
    CONSTRAINT fk_order
      FOREIGN KEY(id_order)
        REFERENCES orders(id_order)
        ON DELETE CASCADE,
    CONSTRAINT fk_item
      FOREIGN KEY(id_item)
        REFERENCES items(id_item)
        ON DELETE CASCADE);
  `;
  const response = await pool.query(createTableText);
  console.log(response);
}

const createTables = async () => {
  await createBusinessTable();
  await createUsersTable();
  await createDriversTable();
  await createItemsTable();
  await createOrdersTable();
  await createOrdersItemsTable();
  pool.end();
}

const dropTables = () => pool.query(
    `DROP TABLE IF EXISTS
      business,
      users,
      drivers,
      items,
      orders,
      orders_items
      CASCADE`).then(res => pool.end()).catch(err => pool.end());  

pool.on('remove', () => {
  console.log('disconnected from db');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
