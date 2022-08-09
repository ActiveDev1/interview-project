import { Module, Provider } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NatsClientModule } from '../services/nats/nats.module'
import { User, UserDatabaseName, UserSchema } from './schemas/user.schema'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

const UserRepositoryProvider: Provider = {
	provide: UserRepository.name,
	useClass: UserRepository
}

@Module({
	imports: [
		NatsClientModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema, collection: UserDatabaseName }
		])
	],
	controllers: [UserController],
	providers: [UserService, UserRepositoryProvider],
	exports: [UserService]
})
export class UserModule {}
