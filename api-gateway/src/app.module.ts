import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			load: [configuration],
			envFilePath: process.env.NODE_ENV === 'development' ? `.env.development` : '.env.prod'
		})
	]
})
export class AppModule {}
