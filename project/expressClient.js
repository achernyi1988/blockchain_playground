var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: false}));


app.get('/', function (req, res) {
  res.send('Hello Elena. How are you ?')
});
 
app.post('/transaction',function(req, res){
	console.log(req.body);
	res.send("amount of the transaction is " + req.body.amount + " bitcoin.");
});

app.get('/mine',function(req, res){
	
}
); 


app.listen(3000, function (){
	console.log("Listening at port 3000");
});

 
