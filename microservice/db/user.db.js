const User = require('../models/user.model')

async function create(data) {
	const user = new User(data)
	return await user.save()
}

async function findById(id) {
	return await User.findById(id)
}

async function findOneByUsername(username) {
	return await User.findOne({ username })
}

module.exports = {
	create,
	findById,
	findOneByUsername
}
