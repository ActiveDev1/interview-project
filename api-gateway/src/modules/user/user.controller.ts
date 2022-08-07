import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/shared/decorators/get-user.decorator'
import { GetIdParam } from '../../.../../shared/dtos/get-id-param.dto'
import { Public } from '../../shared/decorators/public.decorator'
import { AuthGuard } from '../../shared/guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDocument } from './schemas/user.schema'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@Public()
	async findOne(@Param() param: GetIdParam) {
		return await this.userService.findOne(param.id)
	}

	@Patch()
	async update(@GetUser() user: UserDocument, @Body() body: UpdateUserDto) {
		return await this.userService.update(user, body)
	}

	@Delete()
	async delete(@GetUser() user: UserDocument) {
		return await this.userService.delete(user._id)
	}
}
