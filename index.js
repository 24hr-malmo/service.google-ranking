var check = require('./check');

var zmq = require('zmq');
var zonar = require('zonar');

// configs
var port = 5999;
var address = "tcp://0.0.0.0:" + port;

// setup
var broadcaster = zonar.create({ net: '24hr', name: 'google.ranking' });
broadcaster.payload = { 'pub': port };

var socket = zmq.socket('pub');

var lastPosition = -1;

socket.bind(address, function(err) {

    if (err) throw err;

    console.log("Google Ranking publishing service started");

    broadcaster.start(function() {
        console.log("Broadcasting...");        
    });

    function getPosition() {

        console.log('Checking google ranking');

        check
            .find('webbyrå malmö', 'http://www.24hr.se')
            .then(function(result) {
                if (result.found && lastPosition != result.position) {
                    lastPosition = result.position;
                    socket.send('all' + JSON.stringify(result));
                    console.log('Found it on rank %s', result.position);
                } else {
                    console.log('Nothing found on google');
                }
            })
            .then(function() {
                setTimeout(getPosition, 1000 * 60 * 10);
            });

    }

    getPosition();

});

// Greacefully quit
process.on('SIGINT', function() {
    console.log("");
    broadcaster.stop(function() {
        console.log("Zonar has stoped");
        socket.close(function() { });
        process.exit(0);
    });
});
