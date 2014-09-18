var SPI = require("pi-spi");

var numLEDs = 1;
var channels = 3;
var msPerFrame = 5;
var spiInterval = null;

var spi = null;
var noop = function () {};

var curBuf = new Buffer(channels);
curBuf.fill(0x00);

var init = function() {
  if(!!spi)
    throw "Already initialized LEDs!";

  try {
    spi = SPI.initialize("/dev/spidev0.0");
    spi.clockSpeed(1e6);
  }
  catch(e) {
    throw "No SPI, static dev";
  }
};

var setNumLEDs = function(newNumLEDs) {
  numLEDs = newNumLEDs;
  channels = Math.floor(newNumLEDs);
};

var writeLEDs = function(buf) {
  spi.write(buf,noop);
};

module.exports = (function() {
  init();
  return {
    "setNumLEDs":setNumLEDs,
    "writeLEDs":writeLEDs
  };
});
