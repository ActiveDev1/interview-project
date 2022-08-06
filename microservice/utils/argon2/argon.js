const { hash, verify, argon2id } = require('argon2')

const hashPassword = async (string) => {
	return await hash(string, {
		type: argon2id
	})
}

const verifyPassword = async (hash, string) => {
	return await verify(hash, string)
}

module.exports = { hashPassword, verifyPassword }
