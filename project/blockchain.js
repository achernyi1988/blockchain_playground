
const sha256 = require('../node_modules/sha256');
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v1");

class Blockchain
{
	constructor(size)
	{
		this.chain = [];
		this.pendingTransactions = [];
		this.createNewBlock(100, "0","0");//genesis block...first
		
		this.currentNodeUrl = currentNodeUrl;
		this.networkNodes = [];
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

            console.log("previousBlockHash =>", previousBlock["hash"]);
            console.log("currentBlockHash =>", currentBlock["hash"]);
            console.log("blockHash =>", blockHash);
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
		}
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
}

module.exports = Blockchain;