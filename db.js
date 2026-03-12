const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("totally_not_my_privateKeys.db");

// create table if doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS keys(
      kid INTEGER PRIMARY KEY AUTOINCREMENT,
      key BLOB NOT NULL,
      exp INTEGER NOT NULL
    )
  `);
});

module.exports = db;
