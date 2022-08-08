'use strict'

const config = require('./config')
const os = require('os')

module.exports = {
	namespace: 'dev',
	nodeID: (process.env.NODEID ? process.env.NODEID + '-' : '') + os.hostname().toLowerCase(),
	disableBalancer: true,
	transporter: {
		type: config.transporter.type,
		options: {
			servers: config.transporter.servers
		}
	},
	cacher: true,
	tracing: {
		enabled: true,
		exporter: {
			type: 'Console'
		}
	},

	logger: true,

	errorHandler(err, _info) {
		this.logger.warn('Log the error:', err)
		throw err
	}
}
