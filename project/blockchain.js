
const sha256 = require('../node_modules/sha256');
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v1");

class Blockchain
{
	constructor(size)
	{
		this.chain = [];
		this.pendingTransactions = [];
		this.createNewBlock(100, "","");//genesis block...first
		
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
	
	
	
	hashBlock(previosBlockHash, currentBlockData, nonce)
	{
		return sha256(previosBlockHash + nonce.toString() + JSON.stringify(currentBlockData));
	}
	
	proofOfWork(previosBlockHash, currentBlockData)
	{
		let nonce = 0; 
		let hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
		
		while(hash.substring(0,4) !== "0000"){
			nonce++;
		    hash = this.hashBlock(previosBlockHash, currentBlockData, nonce);
		}
		return nonce;
	}
}

module.exports = Blockchain;