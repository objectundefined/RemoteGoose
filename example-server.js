var server = require('./server');

var Match = server.model('Match', { name: String });

server.connectMongo('mongodb://localhost:27017/dating_game');

server.listen(5000);

Match.create({name:'bob'},console.log)

