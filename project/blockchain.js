
const sha256 = require('../node_modules/sha256');
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v1");

function cloneMap(pendingTransitionBalanceAddress, balanceAddress){
    var map1 = new Map(pendingTransitionBalanceAddress);

    var iterator1 = map1[Symbol.iterator]();

    for (let item of iterator1) {
        const key = item[0];
        const value = item[1];
        balanceAddress.set(key,value );
    }
}
class Blockchain
{
	constructor(size)
	{
		this.chain = [];
		this.pendingTransactions = [];
		this.createNewBlock(100, "0","0");//genesis block...first
		
		this.currentNodeUrl = currentNodeUrl;
		this.networkNodes = [];
		this.balanceAddress = new Map([["Alex", 1000],["Elena",1000]]);
        this.pendingTransitionBalanceAddress = new Map(this.balanceAddress);
	}
	
	createNewBlock(nonce, previousHashData, hash ){
		const newBlock = {
			index: this.chain.length + 1,
			timestamp: Date.now(),
			transactions: this.pendingTransactions,
			nonce:nonce,
			previousHashData: previousHashData,
			hash: hash
		};

        cloneMap(this.pendingTransitionBalanceAddress, this.balanceAddress );
        console.log("createNewBlock pendingTransitionBalanceAddress =" , this.pendingTransitionBalanceAddress);
        console.log("createNewBlock balanceAddress =" , this.balanceAddress);

        this.pendingTransactions = [];
		this.chain.push(newBlock);
		return newBlock;
	}



	getLastBlock(){
		return this.chain[this.chain.length - 1];
	}

    isChainValid(blockchain){
	    let validChain = true;

	    for(var i = 1; i < blockchain.length; i++){
	        const currentBlock = blockchain[i];
	        const previousBlock = blockchain[i - 1];
	        const blockHash = this.hashBlock(previousBlock["hash"],
                    {transactions: currentBlock["transactions"], index: currentBlock["index"]}, currentBlock["nonce"] );

	        if(blockHash.substring(0,4) !== "0000") validChain = false;
	        if(currentBlock["previousHashData"] !== previousBlock["hash"]) validChain = false;
        }

        const genesisBlock = blockchain[0];

        let validGenesis = (genesisBlock["nonce"] === 100 && genesisBlock["previousHashData"] === "0" &&
                     genesisBlock["hash"] === "0"   && genesisBlock["transactions"].length === 0);

        return validChain && validGenesis;
    }

	createNewTransaction(amount, sender, recipient){
		const newTransaction = {
				amount : amount,
				sender : sender,
				recipient : recipient,
            transactionID: uuid().split("-").join("")
		};

        this.updateBalanceAddress(amount, sender, recipient);

		return newTransaction;
	}



	addTransactionToPendingTransaction(obj)
	{
		this.pendingTransactions.push(obj);
		return this.getLastBlock()['index'] + 1;
	}



	hashBlock(previousBlockHash, currentBlockData, nonce)
	{
		return sha256(previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData));
	}

	proofOfWork(previousBlockHash, currentBlockData)
	{
		let nonce = 0;
		let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

		while(hash.substring(0,4) !== "0000"){
			nonce++;
		    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		}
		return nonce;
	}

	getBlock(blockHash){
		let foundBlock = null;
		this.chain.forEach(block => {
			if(block.hash === blockHash)
			{
                foundBlock = block;
			}

		});

		return foundBlock;
	}

	getTransaction(id){
		let transactionFound= null;
        let foundBlock = null;
        this.chain.forEach(block => {
        	block.transactions.forEach( transaction => {
                if(transaction.transactionID === id)
                {
                    transactionFound = transaction;
                    foundBlock = block;
                }
			});
        });

        return {
        	transaction: transactionFound,
			block: foundBlock
		};
	}

	getAddressData(address){
        let addressTransactions = [];

        this.chain.forEach(block => {
            block.transactions.forEach( transaction => {

                if(transaction.sender === address || transaction.recipient === address )
                {
                    addressTransactions.push(transaction);
                }
            });
        });

        let balance = 0;

        if(this.balanceAddress.has(address)){
            balance = this.balanceAddress.get(address);
        }
        return {
            addressTransactions: addressTransactions,
            addressBalance: balance
		}
	}

	isBalanceAddressValid(address , amount){

	    if(this.pendingTransitionBalanceAddress.has(address))
        {
            let value = this.pendingTransitionBalanceAddress.get(address);

            if(value - amount >= 0 ) {
                return true;
            }
        }
        return false;
    }


    updateBalanceAddress (amount, sender, recipient){
        if(this.pendingTransitionBalanceAddress.has(recipient)){
            let balance = this.pendingTransitionBalanceAddress.get(recipient);
            balance += amount;
            this.pendingTransitionBalanceAddress.set(recipient, balance);
        }
        else
        {
            this.pendingTransitionBalanceAddress.set(recipient, amount);
        }

        if(this.pendingTransitionBalanceAddress.has(sender)){
            let balance = this.pendingTransitionBalanceAddress.get(sender);

            balance -= amount;
            this.pendingTransitionBalanceAddress.set(sender, balance);
        }
        else
        {
            this.pendingTransitionBalanceAddress.set(sender, 0);
        }
    }
};

module.exports = Blockchain;