import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtStrategy, strategyType } from '../../modules/auth/strategies/jwt.strategy'
import { NatsService } from '../../modules/services/nats/nats.service'

export const AuthGuard = (type: strategyType = 'jwt-access'): Type<CanActivate> => {
	@Injectable()
	class AuthGuardMixin extends JwtStrategy {
		constructor(private readonly reflector: Reflector, readonly natsService: NatsService) {
			super(natsService, type)
		}

		async canActivate(context: ExecutionContext) {
			const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())

			if (isPublic) {
				return true
			}

			return super.canActivate(context)
		}
	}

	return mixin(AuthGuardMixin)
}
