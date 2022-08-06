import { BaseInterfaceRepository } from '../../../shared/interfaces/base-interface-repository.interface'
import { User, UserDocument } from '../schemas/user.schema'

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
	findOneByUsername(username: string): Promise<UserDocument>
	updateOne(id: string, update: Partial<User>): Promise<User>
}
