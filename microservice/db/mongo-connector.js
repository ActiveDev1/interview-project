const mongoose = require('mongoose')
const config = require('../config')

async function initMongoDB() {
	try {
		await mongoose.connect(
			`mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`,
			{
				// user: config.mongodb.username,
				// pass: config.mongodb.password
			}
		)
		console.log('Mongo Connected.')
	} catch (error) {
		console.error('Mongo Error!', error)
	}
}

module.exports = initMongoDB
