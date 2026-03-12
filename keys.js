//Anthony Munoz 3/12/2026
const crypto = require("crypto");
const db = require("./db");

function generateKey(expired = false) {
  const { privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const pem = privateKey.export({
    type: "pkcs1",
    format: "pem",
  });

  const exp = expired
    ? Math.floor(Date.now() / 1000) - 3600   // expired
    : Math.floor(Date.now() / 1000) + 3600;  // valid

  db.run(
    "INSERT INTO keys (key, exp) VALUES (?, ?)",
    [pem, exp]
  );
}

/* ensure DB always has one valid and one expired key */
db.get("SELECT COUNT(*) as count FROM keys", (err, row) => {
  if (!row || row.count === 0) {
    generateKey(false);
    generateKey(true);
  }
});

module.exports = { generateKey };
