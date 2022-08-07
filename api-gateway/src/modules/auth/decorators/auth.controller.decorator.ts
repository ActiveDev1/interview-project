import { applyDecorators, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotAcceptableResponse,
	ApiOkResponse
} from '@nestjs/swagger'
import { Role } from 'src/shared/decorators/roles.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { Role as Roles } from '../../../shared/enums/role.enum'
import { Tokens } from '../interfaces/token.interface'

export function SignupAdminApi() {
	return applyDecorators(
		UseGuards(AuthGuard(), RolesGuard),
		Role(Roles.ADMIN),
		ApiBearerAuth('access-token'),
		ApiCreatedResponse({ description: 'Admin created', type: Tokens }),
		ApiNotAcceptableResponse({ description: 'Admin exists' })
	)
}

export function SignupApi() {
	return applyDecorators(
		ApiCreatedResponse({ description: 'User created', type: Tokens }),
		ApiNotAcceptableResponse({ description: 'User exists' })
	)
}

export function SigninApi() {
	return applyDecorators(
		ApiCreatedResponse({ description: 'Login successful', type: Tokens }),
		ApiForbiddenResponse({ description: 'Username and or password is incorrect' })
	)
}
