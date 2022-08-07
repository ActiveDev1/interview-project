'use strict'

require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.development'
})

const os = require('os')

module.exports = {
	namespace: 'dev',
	nodeID: (process.env.NODEID ? process.env.NODEID + '-' : '') + os.hostname().toLowerCase(),
	disableBalancer: true,
	transporter: {
		type: 'NATS',
		options: {
			servers: process.env.NATS_SERVERS.split(',')
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
