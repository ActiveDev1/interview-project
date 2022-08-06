import { HttpException, HttpStatus } from '@nestjs/common'

export class NatsRequestException extends HttpException {
	constructor() {
		super('An error ocured on nats request-reply', HttpStatus.INTERNAL_SERVER_ERROR)
	}
}
