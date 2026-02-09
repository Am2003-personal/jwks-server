//Anthony Munoz CSCE3550
//2-9-2026
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

//  creates the key holder
let keys = [];

// generates the RSA keypair
function generateKeyPair(expired = false) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const kid = uuidv4();
//rules for expiration
  const expiry = expired
    ? Date.now() - 3600000 
    : Date.now() + 3600000;

  const keyObj = {
    kid,
    publicKey,
    privateKey,
    expiry,
  };

  keys.push(keyObj);
  return keyObj;
}

// generate one valid and one expired at start
generateKeyPair(false);
generateKeyPair(true);

function getValidKeys() {
  return keys.filter((k) => k.expiry > Date.now());
}

function getExpiredKey() {
  return keys.find((k) => k.expiry < Date.now());
}

function getValidKey() {
  return keys.find((k) => k.expiry > Date.now());
}

module.exports = {
  getValidKeys,
  getExpiredKey,
  getValidKey,
};
