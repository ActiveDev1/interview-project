import { Body, Controller, Get, Headers, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetUser } from '../../shared/decorators/get-user.decorator'
import { Role as Roles } from '../../shared/enums/role.enum'
import { NatsService as NatsClient } from '../services/nats/nats.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UserDocument } from '../user/schemas/user.schema'
import {
	RefreshTokenApi,
	SigninApi,
	SignupAdminApi,
	SignupApi
} from './decorators/auth.controller.decorator'
import { LoginDto } from './dto/login.dto'
import { Tokens } from './interfaces/token.interface'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly client: NatsClient) {}

	@Post('signup/admin')
	@SignupAdminApi()
	async signupAdmin(@Body() body: CreateUserDto): Promise<Tokens> {
		return await this.client.request<Tokens, CreateUserDto & { role: Roles }>({
			action: 'auth.signup',
			namespace: 'dev',
			data: { ...body, role: Roles.ADMIN }
		})
	}

	@Post('signup')
	@SignupApi()
	async signup(@Body() body: CreateUserDto): Promise<Tokens> {
		return await this.client.request<Tokens, CreateUserDto>({
			action: 'auth.signup',
			namespace: 'dev',
			data: body
		})
	}

	@Post('login')
	@SigninApi()
	async signin(@Body() body: LoginDto): Promise<Tokens> {
		return await this.client.request<Tokens, LoginDto>({
			action: 'auth.login',
			namespace: 'dev',
			data: body
		})
	}

	@Get('refresh')
	@RefreshTokenApi()
	async refreshToken(@GetUser() user: UserDocument): Promise<Tokens> {
		return await this.client.request<Tokens, { _id: string; role: string }>({
			action: 'auth.refresh',
			namespace: 'dev',
			data: { _id: user._id, role: user.role }
		})
	}
}
