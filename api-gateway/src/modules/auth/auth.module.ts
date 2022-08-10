import { Module } from '@nestjs/common'
import { NatsClientModule } from '../services/nats/nats.module'
import { NatsService } from '../services/nats/nats.service'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'

@Module({
	imports: [UserModule, NatsClientModule],
	controllers: [AuthController],
	providers: [NatsService]
})
export class AuthModule {}
