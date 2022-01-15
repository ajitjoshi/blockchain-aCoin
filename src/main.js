
const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/*
Public Key : 0409aeea5c4e55a251bf8ae7cd9936d8f76f31789a0196a9f522b206b97406ff95ab8323c1fb3dac55fa1878dc1164a505b14affb958340c79e12e60dc64737056

Private Key : d4b1650810df516ebb8e32f16673bcfec203866162caa27d822cbe67bb88abf1
*/
//https://youtu.be/fRV6cGXVQ4I?t=565
//https://www.youtube.com/watch?v=AQV0WNpE_3g : Angular App

const myKey = ec.keyFromPrivate('d4b1650810df516ebb8e32f16673bcfec203866162caa27d822cbe67bb88abf1');
const myWalletAddress = myKey.getPublic('hex');

let aCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "Public Key of toAddress", 10);
console.log("adding new tranasction");
tx1.signTransaction(myKey);
aCoin.addTransaction(tx1);

//miner
console.log("Mining tranasctions");
aCoin.minePendingTransactions(myWalletAddress);

console.log("My account balance : " + aCoin.getBalanceOf(myWalletAddress));

aCoin.chain[1].transactions[0].amount = 1;
console.log("Is chain valid? " + aCoin.isChainValid());