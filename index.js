var check = require('./check');

var zmq = require('zmq');
var zonar = require('zonar');
var Q = require('q');

// configs
var port = 5399;
var address = "tcp://*:" + port;
var rPort = 5398;
var rAddress = "tcp://*:" + rPort;

// setup
var broadcaster = zonar.create({ net: '24hr', name: 'google.ranking' });
broadcaster.payload = { 'pub': port, 'req': rPort };

// Create sockets
var socket = zmq.socket('pub');
var rSocket = zmq.socket('rep');

// this will hold the last address
var lastData = { position: -1 };

function getRanking() {
    console.log('Checking google ranking');
    //if (lastData.position != -1) {
        //return Q.resolve(lastData);
    //} else {
        return check.find('digital byrå malmö', 'https://www.24hr.se');
    //}
}

function periodicCheck() {

    getRanking().then(function(result) {
        lastData = result;
        socket.send('all' + JSON.stringify(lastData));
        console.log('Found it on rank %s', result.position, new Date());
    })
    .then(function() {
        setTimeout(periodicCheck, 1000 * 60 * 10);
    });

}

rSocket.bind(rAddress);

rSocket.on('message', function(dataBuffer) {
    console.log("Got request for current ranking");
    getRanking().then(function(result) {
        lastData = result;
        socket.send('all' + JSON.stringify(lastData));
        console.log('Send rank %s', lastData.position);
    });
});

socket.bind(address, function(err) {

    if (err) { 
        throw err;
    }

    console.log("Google Ranking publishing service started");

    broadcaster.start(function() {

        /*
<<<<<<< HEAD
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
                setTimeout(getPosition, 1000 * 60 * 30);
            });
=======*/
        console.log("Broadcasting...");
        periodicCheck();
// >>>>>>> 3207bd700b2621c5662474e0f8d636f309b4a8a8

    });

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
