const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "yixiaozhu",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkDatabase() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0];
}

module.exports = {
  pool,
  checkDatabase
};
