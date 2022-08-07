import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotAcceptableResponse,
	ApiTags
} from '@nestjs/swagger'
import { Role } from '../../shared/decorators/roles.decorator'
import { Role as Roles } from '../../shared/enums/role.enum'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { RolesGuard } from '../../shared/guards/roles.guard'
import { NatsService as NatsClient } from '../services/nats/nats.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { Tokens } from './interfaces/token.interface'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly client: NatsClient) {}

	@Post('signup/admin')
	@UseGuards(AuthGuard(), RolesGuard)
	@Role(Roles.ADMIN)
	@ApiBearerAuth('access-token')
	@ApiCreatedResponse({ description: 'Admin created', type: Tokens })
	@ApiNotAcceptableResponse({ description: 'Admin exists' })
	async signupAdmin(@Body() body: CreateUserDto): Promise<Tokens> {
		return await this.client.request<Tokens, CreateUserDto & { role: Roles }>({
			action: 'auth.signup',
			namespace: 'dev',
			data: { ...body, role: Roles.ADMIN }
		})
	}

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
