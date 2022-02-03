// Including publicKey and  privateKey from generateKeyPairSync() method with its parameters
const { generateKeyPair } = require('crypto');
generateKeyPair('ec', {
  namedCurve: 'secp256k1',   // Options
  publicKeyEncoding: {
    type: 'spki',
    format: 'der'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'der',
  }
}, (err, publicKey, privateKey) => {
  if (err) {
    console.log (err);
  } else {
  // Handle errors and use the generated key pair.
  console.log ("PUBLIC KEY : " + publicKey.toString('hex') + "\n\n PRIVATE KEY : " + privateKey.toString('hex'));
  }

});
  
