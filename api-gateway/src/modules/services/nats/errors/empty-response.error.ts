import { HttpException, HttpStatus } from '@nestjs/common'

export class EmptyResponseException extends HttpException {
	constructor() {
		super('Empty response data received', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}
