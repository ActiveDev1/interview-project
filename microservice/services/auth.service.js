'use strict'

const { MoleculerError } = require('moleculer').Errors

const config = require('../config')
const userDB = require('../db/user.db')
const argon = require('../utils/argon2')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { promisify } = require('util')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'auth',

	actions: {
		signup: {
			/** @param {Context} ctx  */
			async handler(ctx) {
				const { name, username, password } = ctx.params

				const user = await userDB.findOneByUsername(username)

				if (!_.isEmpty(user)) {
					throw new MoleculerError('Username already exists', 422)
				}

				const hashPassword = await argon.hashPassword(password)
				const newUser = await userDB.create({ name, username, password: hashPassword })

				return await this.generateTokens(newUser)
			}
		},

		login: {
			/** @param {Context} ctx  */
			async handler(ctx) {
				const { username, password } = ctx.params

				const user = await this.validateUser(username, password)
				if (!user) {
					throw new MoleculerError('Username and or password is incorrect', 403)
				}

				return await this.generateTokens(user)
			}
		},

		access: {
			/** @param {Context} ctx  */
			async handler(ctx) {
				const payload = await this.verifyToken(ctx.params)
				const user = await userDB.findById(payload.id)

				if (_.isEmpty(user)) {
					throw new MoleculerError('Unauthorized client', 401)
				}

				return user[0]
			}
		}
	},

	created() {
		this.encode = promisify(jwt.sign)
		this.verify = promisify(jwt.verify)
	},

	methods: {
		async generateTokens(user) {
			const payload = {
				id: user._id,
				role: user.role
			}

			const [accessToken, refreshToken] = await Promise.all([
				this.encode(payload, config.jwt.accessSecret, {
					expiresIn: config.jwt.accessTokenExpiry
				}),
				this.encode(payload, config.jwt.refreshSecret, {
					expiresIn: config.jwt.refreshTokenExpiry
				})
			])
			return { accessToken, refreshToken }
		},

		async verifyToken({ type, token }) {
			try {
				return await this.verify(
					token,
					type == 'jwt-access' ? config.jwt.accessSecret : config.jwt.refreshSecret
				)
			} catch (error) {
				throw new MoleculerError('Unauthorized client', 401, 'UNAUTHORIZED_CLIENT', error)
			}
		},

		async validateUser(username, password) {
			const user = await userDB.findOneByUsername(username)
			return user && (await argon.verifyPassword(user.password, password)) ? user : false
		}
	}
}
