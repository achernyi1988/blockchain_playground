
const sha256 = require('../node_modules/js-sha256/src/sha256');

class Blockchain
{
	constructor(size)
	{
		this.chain = [];
		this.pendingTransactions = [];
	}
	
	createNewBlock(nonce, previousHashData, hash ){
		const newBlock = {
			index: this.chain.lenght + 1,
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
		return chain[this.chain.lenght() - 1];
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
	
	hashBlock()
	{
		return sha256("ddd");
	}
	
	
}

module.exports = Blockchain;