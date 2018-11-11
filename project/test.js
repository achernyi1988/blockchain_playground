
const Blockchain = require('./blockchain');
bl = new Blockchain();

bl.createNewBlock(10, "AAA", "BBB");

bl.createNewTransaction(100, "Alex", "Elena")
bl.createNewTransaction(300, "Elena", "Dmitryi")

bl.createNewBlock(11, "BBB", "CCC");

bl.createNewTransaction(1000, "Alex", "Elena")
bl.createNewTransaction(150, "Elena", "Dmitryi")
bl.createNewTransaction(760, "Alex", "Elena")
bl.createNewTransaction(400, "Elena", "Dmitryi")


bl.createNewBlock(12, "CCC", "DDD");
//console.log(bl);


let transactions = [{
	amount : 10,
	sender: "Alex",
	reciipient: "Elena"
	},
	{
		amount : 8,
		sender: "Elena",
		reciipient: "Peter"	
	}
	
];

console.log(bl.proofOfWork("AAA", transactions ));
console.log(bl.hashBlock("AAA", transactions, 58494 ));


//console.log(bl);
//console.log("last block = \n", bl.getLastBlock());