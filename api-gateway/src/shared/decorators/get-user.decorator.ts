import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { UserDocument } from '../../modules/user/schemas/user.schema'

/**
 * Decorator that get user data from req.user
 */
export const GetUser = createParamDecorator((_data: never, ctx: ExecutionContext): UserDocument => {
	const { user } = ctx.switchToHttp().getRequest<FastifyRequest>()
	return user
})
