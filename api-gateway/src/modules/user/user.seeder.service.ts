import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DataFactory, Seeder } from 'nestjs-seeder'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersSeeder implements Seeder {
	private readonly logger = new Logger(UsersSeeder.name)
	constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

	async seed(): Promise<any> {
		const admin = await this.user.findOne({ username: 'Admin' })
		if (!admin) {
			const users = DataFactory.createForClass(User).generate(1)
			this.logger.log(`Password is ${users[0]?.password}`)

			return this.user.insertMany(users)
		}
	}

	async drop(): Promise<any> {
		return this.user.deleteMany({})
	}
}
