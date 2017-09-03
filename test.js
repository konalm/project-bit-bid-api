var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('connected !!');

    console.log(silence.name);

    KittySchema.methods.speak = function () {
      var greeting = this.name
        ? "the name is " + this.name : "the cat has no name";
      console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);
    var silence = new Kitten({ name: 'Silence'});

    var fluffy = new Kitten({ name: 'fluffy'});
    fluffy.speak();

    fluffy.save(function (err, fluffy) {
      if (err) return console.error(err);
      fluffy.speak();
    });

    Kitten.find(function (err, kittens) {
      if (err) return console.err(err);
      console.log(kittens);
    })
});
