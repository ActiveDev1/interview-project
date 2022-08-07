import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { getNow } from 'src/shared/utils/functions'
import { User } from '../interfaces/user.interface'

export class UserEntity implements User {
	@ApiProperty()
	name: string

	@ApiProperty()
	username: string

	@ApiHideProperty()
	password: string

	@ApiProperty()
	role: string

	@ApiProperty({ default: getNow() })
	created_at: number

	@ApiProperty({ default: getNow() })
	updated_at: number
}
