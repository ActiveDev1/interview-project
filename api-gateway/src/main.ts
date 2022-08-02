import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { RestApiConfig } from './config/configuration'

async function bootstrap() {
	const [logger, prettyPrint] = [process.env.REST_LOGGER, process.env.REST_PRETTY_LOGGER]

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			logger:
				+logger && prettyPrint ? { transport: { target: 'pino-pretty' } } : +logger ? true : false
		})
	)

	app.setGlobalPrefix('api')

	const { host, port } = app.get(ConfigService).get<RestApiConfig>('server.restApi')

	await app.listen(port, host)
}

bootstrap()
