import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { seeder } from 'nestjs-seeder'
import configuration from './config/configuration'
import { User, UserSchema } from './modules/user/schemas/user.schema'
import { UsersSeeder } from './modules/user/user.seeder.service'

seeder({
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
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	]
}).run([UsersSeeder])
