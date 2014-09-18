try {
  var LEDs = require('./leds')();
}
catch(err) {
  console.log("Could not connect to LEDs. Proceeding in dev mode.");
}

var mode = 'loop';
var fps = 50;
var msPerFrame = 20;

var loopData = [];
var loopInterval = null;

var setFPS = function(newFPS) {
  msPerFrame = Math.round(1000/newFPS);

  if(msPerFrame < 5) {
    msPerFrame = 5;
    fps = 200;
  }
  else {
    fps = newFPS;
  }
};

var resetMode = function() {
  if(!!loopInterval)
    clearInterval(loopInterval);
}

var setConfig = function(config) {
  resetMode();

  switch(config.mode) {
    case "loop":
      setFPS(config.fps);
      setLoopData(config.loopData);
      break;
    case "stream":

    case "still":
  }

  mode = config.mode;
};

var setLoopData = function(newLoopData) {
  if(typeof loopData == 'object') {
    if(!!loopInterval)
      clearInterval(loopInterval);

    loopIndex = 0;
    loopData = newLoopData;

    setInterval(doLoopIteration,msPerFrame);
  }
};

var doLoopIteration = function() {
  loopData[loopIndex];

  LEDs.writeLEDs(curBuf);

  loopIndex = (loopIndex+1) % loopData.length;
};

var setLEDs = function(ledBuf) {
  LEDs.writeLEDs(ledBuf);
};

module.exports = (function() {
  return {
    "setConfig":setConfig,
    "setLEDs":setLEDs
  };
});
