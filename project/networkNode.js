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
	const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({ note: 'The transaton will be added in block ' + blockIndex });
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
		note: "New block mined successfuly",
		block: newBlock
	});
	
}); 
 

app.post("/reqister-and-broadcast-node", function (req, res){
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
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
		
	});
});

app.post("/reqister-node", function (req, res){
	const newNodeUrl = req.body.newNodeUrl;
	
});

//register multiple nodes at once
app.post("/reqister-nodes-bulk", function (req, res){
	const newNodeUrl = req.body.newNodeUrl;
	
});
app.listen(port, function (){
	console.log(`Listening at port ${port}...`);
});

 
 