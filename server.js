require("./keys");
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");

const app = express();
const PORT = 8080;

app.use(express.json());
/*
JWKS endpoint
Returns public keys for valid keys
*/
app.get("/.well-known/jwks.json", (req, res) => {

  const now = Math.floor(Date.now() / 1000);

  db.all(
    "SELECT key, kid FROM keys WHERE exp > ?",
    [now],
    (err, rows) => {

      if (err) {
        return res.status(500).json({ error: err });
      }

      const jwks = {
        keys: rows.map(row => {

          const privateKey = crypto.createPrivateKey(row.key);
          const publicKey = crypto.createPublicKey(privateKey);

          return {
            kty: "RSA",
            use: "sig",
            kid: row.kid.toString(),
            alg: "RS256",
            n: publicKey.export({ type: "pkcs1", format: "pem" }),
            e: "AQAB"
          };
        })
      };

      res.json(jwks);
    }
  );
});
/*
AUTH endpoint
Signs JWT with key from DB
*/
app.post("/auth", (req, res) => {

  const useExpired = req.query.expired === "true";
  const now = Math.floor(Date.now() / 1000);

  const query = useExpired
    ? "SELECT * FROM keys WHERE exp <= ? LIMIT 1"
    : "SELECT * FROM keys WHERE exp > ? LIMIT 1";

  db.get(query, [now], (err, row) => {

    if (err || !row) {
      return res.status(500).json({ error: "Key not found" });
    }

    const payload = {
      user: "fakeUser",
      iat: now,
      exp: row.exp
    };

    const token = jwt.sign(payload, row.key, {
      algorithm: "RS256",
      keyid: row.kid.toString()
    });

    res.json({ token });
  });

});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
