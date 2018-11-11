
const sha256 = require('../node_modules/js-sha256/src/sha256');

class Blockchain
{
	constructor(size)
	{
		this.chain = [];
		this.pendingTransactions = [];
		this.createNewBlock(100, "","");//genesis block...first
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
				recipient : recipient
		}
		this.pendingTransactions.push(newTransaction);
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