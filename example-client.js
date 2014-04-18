var rpc = require('axon-rpc')
  , axon = require('axon')
  , req = axon.socket('req');

var client = new rpc.Client(req);
req.connect(5000);

client.methods(console.log)