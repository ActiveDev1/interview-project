const env = require('../utils/environment')

module.exports = {
	mongodb: {
		host: env.str('MONGO_HOST', '127.0.0.1'),
		port: env.num('MONGO_PORT', 27017),
		db: env.str('MONGO_DB', 'UserManagement'),
		username: env.str('MONGO_USERNAME', 'admin'),
		password: env.str('MONGO_PASSWORD', '')
	},
	jwt: {
		accessSecret: env.str('JWT_ACCESS_SECRET', 'p40D57&X#4KHm0UI2'),
		accessTokenExpiry: env.str('JWT_ACCESS_EXPIRY', '1d'),
		refreshSecret: env.str('JWT_REFRESH_SECRET', 'Enn%nF10x3f^6b4Jl'),
		refreshTokenExpiry: env.str('JWT_REFRESH_EXPIRY', '30d')
	},
	transporter: {
		type: env.str('TRANSPORTER_TYPE', 'NATS'),
		servers: env.array('TRANSPORTER_SERVERS', 'nats://localhost:4222')
	}
}
