import { applyDecorators } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam
} from '@nestjs/swagger'
import { UserEntity } from '../entities/user.entity'

export function FindOneApi() {
	return applyDecorators(
		ApiParam({ name: 'id', required: true, allowEmptyValue: false }),
		ApiOkResponse({ type: UserEntity }),
		ApiNotFoundResponse({ description: 'User not found' })
	)
}

export function UpdateApi() {
	return applyDecorators(
		ApiBearerAuth('access-token'),
		ApiOkResponse({ type: UserEntity }),
		ApiConflictResponse({ description: 'User with this username are exists' })
	)
}

export function DeleteApi() {
	return applyDecorators(ApiBearerAuth('access-token'), ApiOkResponse({ type: UserEntity }))
}
