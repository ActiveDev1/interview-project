import { HttpException, HttpStatus } from '@nestjs/common'

export class DuplicateUsername extends HttpException {
	constructor() {
		super('User with this username are exists', HttpStatus.CONFLICT)
	}
}
