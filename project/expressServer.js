var express = require('express');
var bodyParser = require('body-parser');
var Blockchain = require('./blockchain');
const uuid = require("uuid/v1");

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
	
	const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	
	
	bitcoin.createNewTransaction("12.5", "00", nodeAddress);
	
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);
	
	res.json({
		note: "New block mined successfuly",
		block: newBlock
	});
	
}); 
 

app.listen(3000, function (){
	console.log("Listening at port 3000");
});

 
 