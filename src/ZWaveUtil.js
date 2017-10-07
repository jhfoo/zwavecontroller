const log4js = require('log4js'),
    logger = log4js.getLogger(),
    config = require('../conf/config'),
    os = require('os'),
    axios = require('axios');

module.exports = {
    initEventHandlers: (zwave, ZWaveConfig) => {
        zwave.on('driver ready', function (home_id) {
            logger.info('Event: driver ready');
            logger.info('getLibraryVersion(): ' + zwave.getLibraryVersion());
            logger.info('getLibraryTypeName(): ' + zwave.getLibraryTypeName());
            logger.info('*** Press Ctrl-C to end ***');

            ZWaveConfig.HomeId = home_id;
            logger.info('HomeId: ' + ZWaveConfig.HomeId.toString(16));

            process.on('SIGINT', function () {
                logger.info('disconnecting...');
                zwave.disconnect(config.zwave.DriverPaths[os.platform()]);
                process.exit();
            });
        });

        zwave.on('driver failed', function () {
            logger.error('failed to start driver');
            zwave.disconnect();
            process.exit();
        });

        zwave.on('node added', function (NodeId) {
            logger.debug('Event: node added (%d)', NodeId);
            ZWaveConfig.nodes[NodeId] = {
                manufacturer: '',
                manufacturerid: '',
                product: '',
                producttype: '',
                productid: '',
                type: '',
                name: '',
                loc: '',
                classes: {},
                ready: false,
            };
        });

        zwave.on('node event', function (NodeId, data) {
            logger.debug('Event: node event (%d, %s)', NodeId, data);
            if (config.nodes[NodeId] &&
                config.nodes[NodeId].type === 'alarm') {
                logger.debug('Emitting change to remote...');
                axios.get(config.output.EmitEndpoint.BaseServiceUrl + '/hs100/toggle?host=192.168.0.22')
                    .then((resp) => {
                        logger.debug('Response: ' + JSON.stringify(resp.data))
                    })
                    .catch((err) => {
                        logger.error('Response: ' + err);
                    });
            }
        });

        zwave.on('value added', function (NodeId, comclass, value) {
            logger.debug('Event: value added (%d, %d, %s)', NodeId, comclass, JSON.stringify(value, null, 2));

            if (!ZWaveConfig.nodes[NodeId]['classes'][comclass])
                ZWaveConfig.nodes[NodeId]['classes'][comclass] = {};
            ZWaveConfig.nodes[NodeId]['classes'][comclass][value.index] = value;
        });

        zwave.on('value changed', function (nodeid, comclass, value) {
            logger.debug('Event: value changed (%d, %d, %s)', nodeid, comclass, JSON.stringify(value, null, 2));

            if (ZWaveConfig.nodes[nodeid]['ready']) {
                logger.debug('node%d: changed: %d:%s:%s->%s', nodeid, comclass,
                    value['label'],
                    ZWaveConfig.nodes[nodeid]['classes'][comclass][value.index]['value'],
                    value['value']);
            }
            ZWaveConfig.nodes[nodeid]['classes'][comclass][value.index] = value;
        });

    }
};