var express = require('express');
var bodyParser = require('body-parser');
var Blockchain = require('./blockchain');
const uuid = require("uuid/v1");
const rp = require('request-promise');


const port = process.argv[2];


var bitcoin = new Blockchain();
var app = express();

const nodeAddress = uuid().split("-").join("");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: false}));


app.get('/blockchain', function (req, res) {
   res.send(bitcoin);
});
 
app.post('/transaction',function(req, res){
	const newTransaction = req.body;
	res.json({ note: 'The transaction will be added in block ' + newTransaction });
	
	const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
	
	res.json({note: `Transaction will be added in block ${blockIndex} ...`});
});


app.get('/mine',function(req, res){

	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock["hash"];

	const currentBlockData = {
			transactions: bitcoin.pendingTransactions,
			index: lastBlock["index"] + 1
	}
	
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	ы
	const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	
	
	bitcoin.createNewTransaction("12.5", "00", nodeAddress);
	
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);
	
	res.json({
		note: "New block mined successfully",
		block: newBlock
	});
	
}); 

app.post("/transaction/broadcast", function (req, res){
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recepient);
	
	bitcoin.addTransactionToPendingTransaction(newTransaction);
	const requestNodesPromises = [];
	
	bitcoin.networkNodes.forEach(networkNodeUrl =>{ 
	
		const requestOptions = {
				uri: networkNodeUrl + "/transaction",
				method: "POST",
				body: newTransaction,
				json: true
		};
		requestNodesPromises.push(rp(requestOptions));
	});
	
	Promise.all(requestNodesPromises)
	.then(data => {
		 res.json({note: "transaction created and broadcast successfully."});
	})
});

app.post("/register-and-broadcast-node", function (req, res){
	const newNodeUrl = req.body.newNodeUrl;
    const notAlreadyPresent =  bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl != newNodeUrl;

    if(notAlreadyPresent && notCurrentNode){
        bitcoin.networkNodes.push(newNodeUrl);
    }

	const requestNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOption = {
			uri:networkNodeUrl + '/register-node',
			method: 'POST',
			body:{newNodeUrl: newNodeUrl},
			json: true
		};
		requestNodesPromises.push(rp(requestOption));
	});

	Promise.all(requestNodesPromises)
	.then(data => {
		const bulkRegster = {
			uri: newNodeUrl + "/register-nodes-bulk",
			method: "POST",
			body: { allNetworkNodes : [ ...bitcoin.networkNodes , bitcoin.currentNodeUrl]},
			json: true

		};
		return rp(bulkRegster);
	})
	.then( data => {
            res.json({note: "New node registered with network successfully."});
		});
});
app.post("/register-node", function (req, res){
	const newNodeUrl = req.body.newNodeUrl;

	console.log("\"/register-node\" newNodeUrl = " + newNodeUrl)
	const notAlreadyPresent =  bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl != newNodeUrl;
	if(notAlreadyPresent && notCurrentNode){
        bitcoin.networkNodes.push(newNodeUrl);
	}
 
	res.json({note: "New node registered successfully."});
});

//register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res){
	const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(node => {
        const notAlreadyPresent =  bitcoin.networkNodes.indexOf(node) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl != node;

        if(notAlreadyPresent && notCurrentNode){
            bitcoin.networkNodes.push(node);
        }
		});

    res.json({note: "Bulk registration successful."})
});
app.listen(port, function (){
	console.log(`Listening at port ${port}...`);
});

 
 