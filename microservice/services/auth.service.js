'use strict'

const DbService = require('moleculer-db')
const MongooseAdapter = require('moleculer-db-adapter-mongoose')
const { MoleculerError } = require('moleculer').Errors

const UserModel = require('../models/user.model')
const argon = require('../utils/argon2')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { promisify } = require('util')

const adapter = new MongooseAdapter(process.env.MONGO_URI, {
	// auth: {
	// 	user: process.env.MONGO_USERNAME,
	// 	pass: process.env.MONGO_PASSWORD
	// },
	useNewUrlParser: true,
	useUnifiedTopology: true
})

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'auth',

	mixins: [DbService],

	adapter,

	model: UserModel,

	actions: {
		signup: {
			/** @param {Context} ctx  */
			async handler(ctx) {
				const { name, username, password } = ctx.params

				const user = await ctx.call('auth.find', { query: { username } })

				if (!_.isEmpty(user)) {
					throw new MoleculerError('Username already exists', 422)
				}

				const hashPassword = await argon.hashPassword(password)
				const newUser = await ctx.call('auth.create', {
					name,
					username,
					password: hashPassword
				})

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
				const user = await ctx.call('auth.find', { query: { _id: payload.id } })

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
				this.encode(payload, process.env.JWT_ACCESS_SECRET, {
					expiresIn: process.env.JWT_ACCESS_EXPIRE
				}),
				this.encode(payload, process.env.JWT_REFRESH_SECRET, {
					expiresIn: process.env.JWT_REFRESH_EXPIRE
				})
			])
			return { accessToken, refreshToken }
		},

		async verifyToken({ type, token }) {
			try {
				return await this.verify(
					token,
					type == 'jwt-access'
						? process.env.JWT_ACCESS_SECRET
						: process.env.JWT_REFRESH_SECRET
				)
			} catch (error) {
				throw new MoleculerError('Unauthorized client', 401, 'UNAUTHORIZED_CLIENT', error)
			}
		},

		async validateUser(username, password) {
			const user = (await this.broker.call('auth.find', { query: { username } }))[0]
			return user && (await argon.verifyPassword(user.password, password)) ? true : false
		}
	}
}
