var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var controller = require('./led-controller')();

var numUsers = 0;
var numLEDs = 106;

var initServer = function() {
	app.use(express.static(__dirname + '/public'));
	app.use('/bower_components',express.static(__dirname + '/bower_components'));

	server.listen(80);

	initSocket();
};

var initSocket = function() {
	io.on('connection',userDidConnect);
};

var userDidDisconnect = function() {
	numUsers--;
	io.emit('config',{
		'numLEDs':numLEDs,
		'numUsers':numUsers
	});
};

var userDidConnect = function(socket) {
	numUsers++;
	io.emit('config',{
		'numLEDs':numLEDs,
		'numUsers':numUsers
	});

	socket.on('config',controller.setConfig);
	socket.on('cf',controller.setLEDs);
	socket.on('disconnect',userDidDisconnect);
};

initServer();
