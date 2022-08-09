import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DataFactory, Seeder } from 'nestjs-seeder'
import * as argon from '../../shared/utils/argon2'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersSeeder implements Seeder {
	constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

	async seed(): Promise<any> {
		const admin = await this.user.findOne({ username: 'Admin' })
		if (!admin) {
			const users = DataFactory.createForClass(User).generate(1)
			const admin = users[0]
			await this.user.insertMany(users)

			return await this.user.findOneAndUpdate(
				{ username: 'Admin' },
				{ $set: { password: await argon.hashPassword(admin.password as string) } }
			)
		}
	}

	async drop(): Promise<any> {
		return this.user.deleteMany({})
	}
}
