var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var SPI = require("pi-spi");
var spi = SPI.initialize("/dev/spidev0.0");
spi.clockSpeed(1e6);

var numLEDs = 106;
var channels = numLEDs*3;

var buf = new Buffer(channels);
buf.fill(0x00);

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

io.on('connection', function(socket) {
	socket.on('frame', function(data) {
		console.log(data);
	});

	socket.volatile.emit('color-frame');
	socket.emit('frame-config');

});








var ledFrames = [];

for(var led=0; led<numLEDs; led++) {
	var colorRGB = getSpreadColor().values.rgb;
	var cycleFrames = easingLib[Math.floor(Math.random()*numEasings)];
	var cycleFramesNum = cycleFrames.length;
	var offsetNum = Math.floor(Math.random()*cycleFramesNum);

	for(var frame=0; frame<composite; frame++) {
		if(led == 0)
			ledFrames[frame] = new Buffer(channels);

 		var buffer = ledFrames[frame];
		var rIndex = led*3;
		var cycleFrame = cycleFrames[(offsetNum+frame)%cycleFramesNum];

		buffer[rIndex] = Math.round(cycleFrame*colorRGB[0]);
		buffer[rIndex+1] = Math.round(cycleFrame*colorRGB[1]);
		buffer[rIndex+2] = Math.round(cycleFrame*colorRGB[2]);
	}
}

var curFrame = 0;

function init() {

}

function noop() {}

function loop() {
	var buf = ledFrames[curFrame];

	if(curFrame < composite-1)
		curFrame++;
	else
		curFrame = 0;

	spi.write(buf,noop);
}

loop();
setInterval(loop,15);
