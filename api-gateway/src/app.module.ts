import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import configuration from './config/configuration'
import { AuthModule } from './modules/auth/auth.module'
import { NatsModule } from './modules/services/nats/nats.module'
import { UserModule } from './modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			load: [configuration],
			envFilePath: process.env.NODE_ENV === 'development' ? `.env.development` : '.env.prod'
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>('databases.mongodb.uri')
			}),
			inject: [ConfigService]
		}),
		AuthModule,
		UserModule,
		NatsModule
	]
})
export class AppModule {}
