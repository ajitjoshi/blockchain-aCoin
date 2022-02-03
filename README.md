# Blockchain Core PoC (JavaScript)

This project demonstrate the core blockchain functionality. It creates new blockchain, allows to create new transactions and add transactions to a block. Mine a block with Proof-of-Work algorithm & put the block on blockchain.

There are three classes defined in the PoC, for simplicity its within a single JavaScript file.

1. Transaction
2. Block
3. Blockchain


## Transaction Class ##

Transaction class takes care of transaction functions. The constructor is used to create new transaction object to be included into a block. 

**1. Hash Calculation :** ```calculateHash()``` function uses SHA256 and returns the hash of the transaction which is used *sign* and *verify* the transaction.

```JS
calculateHash() {
    return crypto.createHash('sha256')
        .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
        .digest('hex');
}
```

**2. Signing Transaction:** ```signTransaction(signingKey)``` function is used to sign the transaction. For sending any transaction to blockchain, the transaction must be signed by *sender* using his private key. 

```getPublic()``` function returns the *public key* of the *signingKey* parameter to ensure transaction is signed by *sender*.

Transaction is then *signed* using transaction hash and stored into *signature* state variable.

```JS
const sig = signingKey.sign(hashTx, 'base64');
this.signature = sig.toDER('hex');
```

**3. Validate Transaction :** This class also support transaction validation using ```isValid()``` function. This function gets the *public key* from *sender address*. Then it recalculates the transaction hash to uses ```verify()``` function to validate the transaction.

```JS
publicKey.verify(this.calculateHash(), this.signature);
```

In case of transaction being *mining reward*, the *sender address* will be null. 

## Block Class ##

Block class takes care of all Block functionalities. Constructor is used to create block with number of transactions, and defaults *nonce* as zero.

**1. Block Hash :** ```calculateHash()``` function of Block class created block hash. This sample is NOT using Merkle Tree. Technically Merkel Tree hash is included in the block and then block hash is generated. 

**2. Mining a Block:** This is at the core of blockchain. There are multiple consensus algorithm. Level-1 blockchains mostly uses Proof-of-Work as consensus algorithn. However, mostly they are moving away from PoW due to massive energy consumption.
The difficulty level is state variable, set it to 2 (0x00*).

```JS
mineBlock(difficulty) {
    console.log(this.blockHash);
    while(this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.blockHash = this.calculateHash();
    }
    console.log("Block mined : " + this.blockHash);
}
```

**3. Validate Transactions :** Finally, ```hasValidTransactions()``` leverages Transaction Class's ```isValid()``` method to ensure block has valid transaction 

## The Blockchain ##

All blockchain functionalities are in Blockchain class. 

**1. Blockchain Initialization :** the *constructor* initializes the blockchain by:
    - Creating *genesis block* using ```createGenesisBlock()```
    - Set mining difficulty level, and 
    - Set mining rewards
Usually genesis block timestamp is fixed at the time of launch of the blockchain.

**2. Blockchain Mining :*** In real-world, miner selects transaction he/she want to include in the block depending upon transaction fee to enhance mining profitability. There is a concept of **mempool** which is a pool of all transactions, which are not yet commited to any block.

For simplicity, in this PoC all pending transactions are included at the time when mining is invoked. Also, it creates transaction for reward as well before mining, so miner is mining its own reward trasnaction! :) ... now, this is not the way blockchain works. 

*Longest chain wins* in blockchain consesus mechanism. There are always possiblities to generate *orphan blocks* due to the way blocks added and blockchains are synced across the nodes. 

```JS
minePendingTransactions(minerAddress) {

    const rewardTx = new Transaction(null, minerAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    let block = new Block(Date.now(), this.pendingTransactions); //replace with transaction selection logic in real world
    block.mineBlock(this.difficulty);

    console.log("Block is successfully mined!\n");

    this.chain.push(block);

    this.pendingTransactions = [];
}
```

**3. Adding a Transaction :** Some basic checks are done before adding a transaction. There are 200+ checks in real-world scenario. Here, only validity of address and transaction is used, and additionally restricting self transactions!

**4. Wallet Balance :** ```getBalanceOf(address)``` function uses unspent transaction output (UTXO) functionality, hence it loops through entire chain to get the balance of any address. This is the way Bitcoin wallet works. We don't have a *balance* concept in Bitcoin. While doing any transaction we have to select prior un-used transaction, and any excess amount is self-transferred in the same transaction block.

```JS
getBalanceOf(address) {
    let balance = 0;
    for(const block of this.chain){
        for (const trans of block.transactions){
            if (trans.fromAddress === address) {
                balance -= trans.amount;
            }
            if (trans.toAddress === address) {
                balance += trans.amount;
            }
        }
    }
    return balance;
}
```

**5. Get All Transactions :** ```getAllTransactionsForWallet(address)``` gets all the transactions for specified address.

**6. Validate Chain :** Python PoC has implementation of generating nodes and validating chain against all the nodes. In this JS PoC, validation is done for checking block & transaction hashes using ```isChainValid()``` function

## Running The Application ##

```main.js``` is preset with some sample and can be experimented with some changes. Node & NPM is required to run the app to manage dependencies. Run ```npm i``` on the root to get all dependencies and then run

    $ node main.js

It has a predefined public/private key pair for testing purpose. 


## Some Informative Links ##

- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Secure Hash Algorithm family](https://webspace.science.uu.nl/~tel00101/liter/Books/CrypCont.pdf)
- [The Blockchain Economy](https://medium.com/cryptoeconomics-australia/the-blockchain-economy-a-beginners-guide-to-institutional-cryptoeconomics-64bf2f2beec4)
- [Meaning of Decentralization](https://medium.com/@VitalikButerin/the-meaning-of-decentralization-a0c92b76a274)
- [Byzantine Fault Tolerance](https://medium.com/loom-network/understanding-blockchain-fundamentals-part-1-byzantine-fault-tolerance-245f46fe8419)
- [Consensus Mechanism](https://101blockchains.com/consensus-algorithms-blockchain/)
- [Bitcoin Energy Consumption](https://blog.bitcoin.org.hk/bitcoin-mining-and-energy-consumption-4526d4b56186)
- [How Bitcoin Mining Works](https://101blockchains.com/how-bitcoin-works/)
- [How Mempool Works](https://blog.kaiko.com/an-in-depth-guide-into-how-the-mempool-works-c758b781c608)
- [Soft & Hard Forks](https://101blockchains.com/what-is-a-cryptocurrency-fork/)
