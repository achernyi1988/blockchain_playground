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
	
}


