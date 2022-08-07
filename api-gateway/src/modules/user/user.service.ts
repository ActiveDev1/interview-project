import { Inject, Injectable } from '@nestjs/common'
import * as argon from '../../shared/utils/argon2'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DuplicateUsername } from './errors/duplicate-username.error'
import { UserNotFound } from './errors/user-not-found.error'
import { UserRepositoryInterface } from './interfaces/user.repository.interface'
import { User, UserDocument } from './schemas/user.schema'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepositoryInterface
	) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		const { name, username, password } = createUserDto
		const user = await this.userRepository.findOneByUsername(username)

		if (user) {
			throw new DuplicateUsername()
		}

		const hashedPassword = await argon.hashPassword(password)
		return await this.userRepository.create<CreateUserDto>({
			name,
			username,
			password: hashedPassword
		})
	}

	async findOne(id: string): Promise<UserDocument> {
		const user = await this.userRepository.findById(id)

		if (!user) {
			throw new UserNotFound()
		}

		return user
	}

	async findOneWithUsername(username: string): Promise<UserDocument> {
		const user = await this.userRepository.findOne(
			{ username },
			{ name: true, username: true, password: true }
		)

		if (!user) {
			throw new UserNotFound()
		}

		return user
	}

	async update(currentUser: UserDocument, updateUserDto: UpdateUserDto): Promise<User> {
		let { username, password } = updateUserDto

		if (username) {
			const user = await this.userRepository.findOneByUsername(username)

			if (user && currentUser.username !== username) {
				throw new DuplicateUsername()
			}
		}

		if (password) {
			updateUserDto.password = await argon.hashPassword(password)
		}

		return await this.userRepository.updateOne(currentUser._id, updateUserDto)
	}

	async delete(id: string): Promise<User> {
		return await this.userRepository.delete(id)
	}
}
