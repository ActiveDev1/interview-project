import { HttpException, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Client, ClientNats, Transport } from '@nestjs/microservices'
import { Client as NatsClient, NatsMsg } from '@nestjs/microservices/external/nats-client.interface'
import * as _ from 'lodash'
import { createInbox } from 'nats'
import { EmptyResponseException } from './errors/empty-response.error'
import { RequestOptions } from './interfaces/request-options.interface'
import { Request } from './interfaces/request.interface'
import { Response } from './interfaces/response.interface'

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
	@Client({ transport: Transport.NATS })
	private readonly client: ClientNats
	private natsClient: NatsClient
	private readonly logger = new Logger(NatsService.name)
	private readonly defaultRequestOption: RequestOptions = { noMux: true, timeout: 2000 }
	private readonly subjectPrefix = 'MOL'

	async onModuleInit() {
		await this.client.connect()
		this.natsClient = await this.client.createClient()
		this.logger.log('Nats client connected')
	}

	onModuleDestroy() {
		this.natsClient.close()
		this.logger.log('Nats client connection closed!')
	}

	async request<TResult, TInput>(
		request: Request<TInput>,
		options?: RequestOptions
	): Promise<TResult> {
		const subject =
			this.subjectPrefix +
			(request.namespace ? `-${request.namespace}` : '') +
			`.REQB.${request.action}`
		const { dataBuffer, inbox } = this.getRequestData<TInput>(request)
		const opts = this.getDefaultOptions(options, { inbox, namespace: request.namespace })

		const reply = await this.natsClient.request(subject, dataBuffer, opts)

		return this.getResponseData(reply)
	}

	deserialize<TResult>(reply: NatsMsg) {
		return JSON.parse(reply.data.toString()) as Response<TResult>
	}

	private getRequestData<TInput>(request: Request<TInput>) {
		const inbox = createInbox()

		const dataBuffer = Buffer.from(
			JSON.stringify({
				ver: '4',
				action: request.action,
				sender: inbox,
				params: request.data
			})
		)

		return { dataBuffer, inbox }
	}

	private getResponseData<TResult>(natsMsg: NatsMsg): TResult | null {
		if (natsMsg.data === null || natsMsg.data.length === 0) {
			throw new EmptyResponseException()
		}

		const resposne = this.deserialize<TResult>(natsMsg)

		if (!resposne.success) {
			this.logger.error('Get unsuccessful message from microservice')
			throw new HttpException(resposne.error?.message, resposne.error?.code)
		}

		return resposne.data ? resposne.data : null
	}

	private getDefaultOptions(
		options: RequestOptions,
		{ inbox, namespace }: { inbox: string; namespace: string }
	): RequestOptions {
		if (!options) {
			options = { ...this.defaultRequestOption }
		}

		if (_.isEmpty(options?.reply)) {
			const reply = this.subjectPrefix + (namespace ? `-${namespace}` : '') + `.RES.${inbox}`

			options.reply = reply
		}

		return options
	}
}
