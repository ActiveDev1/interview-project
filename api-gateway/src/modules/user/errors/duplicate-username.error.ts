import { HttpException, HttpStatus } from '@nestjs/common'

export class DuplicateUsername extends HttpException {
	constructor() {
		super('Duplicate username', HttpStatus.CONFLICT)
	}
}
