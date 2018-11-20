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

	const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
	
	res.json({note: `Transaction will be added in block ${blockIndex} ...`});
});

app.post("/transaction/broadcast", function (req, res){
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const requestNodesPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl =>{

        const requestOptions = {
            uri: networkNodeUrl + "/transaction",
            method: "POST",
            body: newTransaction,
            json: true
        };
        rp(requestOptions);
    });

    res.json({note: "transaction created and broadcast successfully."});
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


app.get('/mine',function(req, res){

    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock["hash"];

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock["index"] + 1
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);

    const requestNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNode =>{

        const requestOption = {
            url:networkNode + "/receive-new-block",
            method: "POST",
            body: {newBlock: newBlock},
            json: true
        };
        requestNodesPromises.push(rp(requestOption));
    });
    Promise.all(requestNodesPromises)
        .then(data =>{
            const requestOption = {
                url:bitcoin.currentNodeUrl + "/transaction/broadcast",
                method: "POST",
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };
            return rp(requestOption);
        })
        .then(data =>{
            res.json({
                note: "New block mined successfully",
                block: newBlock
            });
        });
});

app.post('/receive-new-block',function(req, res){

    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();

    const correctHash = lastBlock.hash === newBlock.previousHashData;
    const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

    if(correctHash && correctIndex){
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: "New block received and accepted",
            newBlock: newBlock
        });
    }
    else{
        res.json({
            note: "New block rejected",
            newBlock: newBlock
        });
    }
});

app.get("/consensus", function(req, res){

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
       const requetsOption = {
           uri: networkNodeUrl+ "/blockchain",
           method: "GET",
           json: true
       };

        requestPromises.push(rp(requetsOption));
    });

    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain =>{

                if(blockchain.chain.length > maxChainLength)
                {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                }
            });

            
            if(!newLongestChain || (newLongestChain && !bitcoin.isChainValid(newLongestChain))){
                res.json({
                     note: "current chain has not been replaced",
                     chain: bitcoin.chain
                });
            }
            else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;

                res.json({
                    note: "this chain has been replaced",
                    chain: bitcoin.chain
                });
            }
        });

});


app.listen(port, function (){
	console.log(`Listening at port ${port}...`);
});

 
 