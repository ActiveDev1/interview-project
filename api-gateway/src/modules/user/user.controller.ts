import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags
} from '@nestjs/swagger'
import { GetUser } from 'src/shared/decorators/get-user.decorator'
import { GetIdParam } from '../../.../../shared/dtos/get-id-param.dto'
import { Public } from '../../shared/decorators/public.decorator'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { UserDocument } from './schemas/user.schema'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@Public()
	@ApiParam({ name: 'id', required: true, allowEmptyValue: false })
	@ApiOkResponse({ type: UserEntity })
	@ApiNotFoundResponse({ description: 'User not found' })
	async findOne(@Param() param: GetIdParam) {
		return await this.userService.findOne(param.id)
	}

	@Patch()
	@ApiBearerAuth('access-token')
	@ApiOkResponse({ type: UserEntity })
	@ApiConflictResponse({ description: 'User with this username are exists' })
	async update(@GetUser() user: UserDocument, @Body() body: UpdateUserDto) {
		return await this.userService.update(user, body)
	}

	@Delete()
	@ApiBearerAuth('access-token')
	@ApiOkResponse({ type: UserEntity })
	async delete(@GetUser() user: UserDocument) {
		return await this.userService.delete(user._id)
	}
}
