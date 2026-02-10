//Anthony Munoz CSCE3550
//2-9-2026
const express = require("express");
const jwt = require("jsonwebtoken");
const { getValidKeys, getExpiredKey, getValidKey } = require("./keys");

const app = express();
const PORT = 8080;

app.use(express.json());

/*
JWKS endpoint
Returns only NON expired public keys
*/
app.get("/.well-known/jwks.json", (req, res) => {
  const validKeys = getValidKeys();

  const jwks = {
    keys: validKeys.map((k) => ({
      kty: "RSA",
      use: "sig",
      kid: k.kid,
      alg: "RS256",
      n: k.publicKey.export({ type: "pkcs1", format: "pem" }),
      e: "AQAB",
    })),
  };

  res.json(jwks);
});

/*
AUTH endpoint
POST request returns signed JWT
If ?expired=true ,goes to sign with expired key
*/
app.post("/auth", (req, res) => {
  const useExpired = req.query.expired === "true";

  let key;
  if (useExpired) {
    key = getExpiredKey();
  } else {
    key = getValidKey();
  }

  if (!key) {
    return res.status(500).json({ error: "Key not found" });
  }

  const payload = {
    user: "fakeUser",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(key.expiry / 1000),
  };

  const token = jwt.sign(payload, key.privateKey, {
    algorithm: "RS256",
    keyid: key.kid,
  });

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`JWKS server running on port ${PORT}`);
});

module.exports = app;
