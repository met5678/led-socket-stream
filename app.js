var app = require('http').createServer(handler);
//var conv = require('convert-hex');
var io = require('socket.io')(app);
var fs = require('fs');
var SPI = require("pi-spi");


var spi = SPI.initialize("/dev/spidev0.0");
spi.clockSpeed(1e6);

var numLEDs = 106;
var channels = numLEDs*3;

app.listen(80);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
	function(err,data) {
		if(err) {
			res.writeHead(500);
			return res.end('Error loading index.html');

		}

		res.writeHead(200);
		res.end(data);
	});
}

var curBuf = new Buffer(channels);
curBuf.fill(0);

var noop = function () {};

var writeLEDs = function() {
	spi.write(curBuf,noop);
};


io.on('connection', function(socket) {
	socket.emit('config',{
		'numLEDs':numLEDs,
		'testBuf':curBuf
	});
	socket.on('cf', function(data) {
		curBuf = data;
		writeLEDs();
		//console.log(data);
		//curBuf = new Buffer(conv.hexToBytes(data));
	});
});

//setInterval(writeLEDs,16);
