
const Blockchain = require('./blockchain');
bl = new Blockchain();

bl.createNewBlock(123123, "OOOOOO", "PPPPPPP");

console.log(bl);