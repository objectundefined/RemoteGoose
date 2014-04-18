var client = require('./client');
var server = require('./server');
console.log(client===server);

client.foo = "HAHA";
console.log(server);
/*
mongoose.connect('unix:///fooo');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) console.error(err);
  console.log('meow');
});

*/