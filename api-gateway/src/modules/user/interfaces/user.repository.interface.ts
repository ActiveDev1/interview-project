import { BaseInterfaceRepository } from '../../../shared/interfaces/base-interface-repository.interface'
import { User } from '../schemas/user.schema'

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {}
