import fastify from 'fastify'
import { UserDocument } from '../../modules/user/schemas/user.schema'

declare module 'fastify' {
	interface FastifyRequest {
		role: Role
		user: UserDocument
	}
}
