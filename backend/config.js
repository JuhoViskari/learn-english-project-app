require("dotenv").config();
const pass = process.env.MY_SECRET_KEY;
const user = process.env.MY_SECRET_KEY_2;
const db = process.env.MY_SECRET_KEY_3;
const host = process.env.MY_SECRET_KEY_4;

const config = {
  connectionLimit: 10,
  host: host,
  user: user,
  password: pass,
  database: db,
};
module.exports = config;
