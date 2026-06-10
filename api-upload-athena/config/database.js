// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Test de connexion
// pool
//   .getConnection()
//   .then((connection) => {
//     console.log("✅ Connexion à la base de données établie avec succès");
//     connection.release();
//   })
//   .catch((err) => {
//     console.error("❌ Erreur de connexion à la base de données:", err);
//   });

// module.exports = pool;

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
});

pool.on("connection", function (connection) {
  connection.on("error", function (err) {
    console.error("Erreur MySQL:", err);
  });
  connection.on("query", function (query) {
    console.log("SQL:", query.sql);
  });
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connexion à la base de données établie avec succès");
    connection.release();
  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données:", err);
    process.exit(1);
  }
};

testConnection();

module.exports = pool;
