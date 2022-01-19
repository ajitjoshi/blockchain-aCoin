// Node.js program to demonstrate the
// crypto.generateKeyPairSync() method
  
// Including generateKeyPairSync from crypto module
const { generateKeyPairSync } = require('crypto');
  
// Including publicKey and  privateKey from 
// generateKeyPairSync() method with its 
// parameters
const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  console.log (err + " : - : " + publicKey.toString('hex') + " : - : " + privateKey);
});
  
