import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class LoginDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Length(3, 20)
	username: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Length(6, 30)
	password: string
}
