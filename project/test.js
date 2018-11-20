
const Blockchain = require('./blockchain');
bl = new Blockchain();


bc1 =
{
    "chain": [
    {
        "index": 1,
        "timestamp": 1542725877207,
        "transactions": [],
        "nonce": 100,
        "previousHashData": "0",
        "hash": "0"
    },
    {
        "index": 2,
        "timestamp": 1542725930032,
        "transactions": [
            {
                "amount": 500,
                "sender": "Alex",
                "recipient": "Elena",
                "transactionID": "bcde7e80ecd411e8b75d0d411d4eafd4"
            },
            {
                "amount": 1000,
                "sender": "Alex",
                "recipient": "Elena",
                "transactionID": "c2213c20ecd411e8b75d0d411d4eafd4"
            },
            {
                "amount": 1500,
                "sender": "Alex",
                "recipient": "Elena",
                "transactionID": "c45978e0ecd411e8b75d0d411d4eafd4"
            },
            {
                "amount": 2000,
                "sender": "Alex",
                "recipient": "Elena",
                "transactionID": "c6fd21a0ecd411e8b75d0d411d4eafd4"
            }
        ],
        "nonce": 62319,
        "previousHashData": "0",
        "hash": "00005b2d32f4c14e753fea6105e3c484ddce1e852d26a6353766f627637d5b34"
    },
    {
        "index": 3,
        "timestamp": 1542725935708,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "aa790580ecd411e8b75d0d411d4eafd4",
                "transactionID": "c9f8d570ecd411e8b75d0d411d4eafd4"
            }
        ],
        "nonce": 149110,
        "previousHashData": "00005b2d32f4c14e753fea6105e3c484ddce1e852d26a6353766f627637d5b34",
        "hash": "00005a8af51e1aaa6357a98a44b031687c352928afad1136c0d3d6ef2853e385"
    },
    {
        "index": 4,
        "timestamp": 1542725951814,
        "transactions": [
            {
                "amount": 12.5,
                "sender": "00",
                "recipient": "aa790580ecd411e8b75d0d411d4eafd4",
                "transactionID": "cd580600ecd411e8b75d0d411d4eafd4"
            },
            {
                "amount": 5000,
                "sender": "Alex",
                "recipient": "Elena",
                "transactionID": "d3673b60ecd411e8b75d0d411d4eafd4"
            }
        ],
        "nonce": 164930,
        "previousHashData": "00005a8af51e1aaa6357a98a44b031687c352928afad1136c0d3d6ef2853e385",
        "hash": "0000056c58ce88becbc30c592b47eb878f5b2b41ea730a5ccfbf6fb76042da47"
    }
],
    "pendingTransactions": [
    {
        "amount": 12.5,
        "sender": "00",
        "recipient": "aa790580ecd411e8b75d0d411d4eafd4",
        "transactionID": "d6f14c80ecd411e8b75d0d411d4eafd4"
    }
],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
};


console.log("Is VALID = ", bl.isChainValid(bc1.chain));

// bl.createNewBlock(10, "AAA", "BBB");
//
// bl.createNewTransaction(100, "Alex", "Elena")
// bl.createNewTransaction(300, "Elena", "Dmitryi")
//
// bl.createNewBlock(11, "BBB", "CCC");
//
// bl.createNewTransaction(1000, "Alex", "Elena")
// bl.createNewTransaction(150, "Elena", "Dmitryi")
// bl.createNewTransaction(760, "Alex", "Elena")
// bl.createNewTransaction(400, "Elena", "Dmitryi")
//
//
// bl.createNewBlock(12, "CCC", "DDD");
// //console.log(bl);
//
//
// let transactions = [{
// 	amount : 10,
// 	sender: "Alex",
// 	reciipient: "Elena"
// 	},
// 	{
// 		amount : 8,
// 		sender: "Elena",
// 		reciipient: "Peter"
// 	}
//
// ];
//
// console.log(bl.proofOfWork("AAA", transactions ));
// console.log(bl.hashBlock("AAA", transactions, 58494 ));


//console.log(bl);
//console.log("last block = \n", bl.getLastBlock());