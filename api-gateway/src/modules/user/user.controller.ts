import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetIdParam } from '../../.../../shared/dtos/get-id-param.dto'
import { GetUser } from '../../shared/decorators/get-user.decorator'
import { Public } from '../../shared/decorators/public.decorator'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { DeleteApi, FindOneApi, UpdateApi } from './decorators/user.controller.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDocument } from './schemas/user.schema'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@Public()
	@FindOneApi()
	async findOne(@Param() param: GetIdParam) {
		return await this.userService.findOne(param.id)
	}

	@Patch()
	@UpdateApi()
	async update(@GetUser() user: UserDocument, @Body() body: UpdateUserDto) {
		return await this.userService.update(user, body)
	}

	@Delete()
	@DeleteApi()
	async delete(@GetUser() user: UserDocument) {
		return await this.userService.delete(user._id)
	}
}
