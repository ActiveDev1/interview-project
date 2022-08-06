import { Body, Controller, Post } from '@nestjs/common'
import { NatsService as NatsClient } from '../services/nats/nats.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { Tokens } from './interfaces/token.interface'

@Controller('auth')
export class AuthController {
	constructor(private readonly client: NatsClient) {}

	@Post('signup')
	async signup(@Body() body: CreateUserDto): Promise<Tokens> {
		return await this.client.request<Tokens, CreateUserDto>({
			action: 'auth.signup',
			namespace: 'dev',
			data: body
		})
	}

	@Post('login')
	async signin(@Body() body: LoginDto): Promise<Tokens> {
		return await this.client.request<Tokens, LoginDto>({
			action: 'auth.login',
			namespace: 'dev',
			data: body
		})
	}
}
