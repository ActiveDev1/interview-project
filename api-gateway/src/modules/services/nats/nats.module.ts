import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { NatsService } from './nats.service'

export const NatsClientModule = ClientsModule.registerAsync([
	{
		name: 'NATS_SERVICE',
		imports: [ConfigModule],
		useFactory: (config: ConfigService) => ({
			transport: Transport.NATS,
			options: {
				servers: config.get('nats.servers'),
				reconnect: true
			}
		}),
		inject: [ConfigService]
	}
])

@Global()
@Module({
	imports: [NatsClientModule],
	providers: [NatsService],
	exports: [NatsService]
})
export class NatsModule {}
