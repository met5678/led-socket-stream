

var socket = io.connect(document.location.hostname);

var numLEDs = -1;
var frameIndex = 0;

var emitFrame = function() {
  var channels = numLEDs * 3;
  /*var brightness = frameIndex.toString(16);
  if(brightness.length == 1) {
    brightness = "0"+brightness;
  }
  var str = '';
  for(var a=0; a<channels; a++) {
    str += brightness;
  }*/

  var ab = new ArrayBuffer(channels);
  var buf = new Uint8ClampedArray(ab);
  for(var a=0; a<channels; a++) {
    if(a == frameIndex)
      buf[a] = 0xFF;
    else
      buf[a] = 0x00;
  }
  socket.emit('cf',ab);
  frameIndex = (frameIndex+1)%channels;
};

socket.on('config', function(data) {
  numLEDs = data.numLEDs;
});
