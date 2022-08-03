import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common'
import { GetIdParam } from '../../.../../shared/dtos/get-id-param.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	async findOne(@Param() param: GetIdParam) {
		return await this.userService.findOne(param.id)
	}

	@Patch(':id')
	async update(@Param() param: GetIdParam, @Body() body: UpdateUserDto) {
		return await this.userService.update(param.id, body)
	}

	@Delete(':id')
	async delete(@Param() param: GetIdParam) {
		return await this.userService.delete(param.id)
	}
}
