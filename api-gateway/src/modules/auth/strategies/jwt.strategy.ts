import { CanActivate, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { NatsService } from '../../../modules/services/nats/nats.service'
import { UserDocument } from '../../../modules/user/schemas/user.schema'

export type strategyType = 'jwt-access' | 'jwt-refresh'
type requestInput = {
	token: string
	type: strategyType
}
export class JwtStrategy implements CanActivate {
	constructor(protected readonly natsService: NatsService, private type: strategyType) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest<FastifyRequest>()
		const auth = req.headers.authorization

		if (!auth || !auth.startsWith('Bearer')) {
			return false
		}

		const token = auth.slice(7)

		const user = await this.natsService.request<UserDocument, requestInput>({
			namespace: 'dev',
			action: 'auth.access',
			data: { type: this.type, token }
		})

		if (!user) {
			return false
		}

		req.user = user

		return true
	}
}
