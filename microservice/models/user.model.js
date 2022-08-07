const {
	model,
	Schema,
	SchemaTypes: { String }
} = require('mongoose')
const unixTimestamp = require('mongoose-unix-timestamp')
const Roles = require('./constants/roles.enum')

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: Object.values(Roles), default: 'User' }
	},
	{
		versionKey: false,
		timestamp: false
	}
)

userSchema.plugin(unixTimestamp)

module.exports = model('User', userSchema, 'users')
