import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { NatsClientModule } from '../services/nats/nats.module'
import { NatsService } from '../services/nats/nats.service'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'

@Module({
	imports: [
		UserModule,
		NatsClientModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('jwt.access.secret'),
				signOptions: { expiresIn: config.get<string | number>('jwt.access.expiresIn') }
			}),
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [NatsService]
})
export class AuthModule {}
