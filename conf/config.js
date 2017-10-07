module.exports = {
    zwave: {
        ConsoleOutput: false,
        DriverPaths: {
            "darwin": '/dev/cu.usbmodem1411',
            "linux": '/dev/ttyACM0',
            //  "linux": '/dev/ttyUSB0',
            "windows": '\\\\.\\COM3'
        }
    },
    log4js: {
        appenders: {
            console: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'debug'
            }
        }
    },
    output: {
        EmitEndpoint: {
            BaseServiceUrl: 'http://192.168.0.12:8000'
        }
    },
    nodes: {
        2: {
            type: 'alarm'
        }
    }
};