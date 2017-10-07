const log4js = require('log4js'),
    config = require('./conf/config'),
    ZWaveUtil = require('./src/ZWaveUtil'),
    os = require('os');

var ZWave = require('openzwave-shared');

log4js.configure(config.log4js);

const logger = log4js.getLogger(),
    zwave = new ZWave({
        ConsoleOutput: config.zwave.ConsoleOutput
    });
var ZWaveConfig = {
    HomeId: null,
    nodes: []
};

ZWaveUtil.initEventHandlers(zwave, ZWaveConfig);

logger.info("Connecting to ZWave controller at " + config.zwave.DriverPaths[os.platform()]);
zwave.connect(config.zwave.DriverPaths[os.platform()]);