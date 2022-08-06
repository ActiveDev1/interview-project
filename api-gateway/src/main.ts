import { ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { RestApiConfig } from './config/configuration'
import { ValidationException, ValidationFilter } from './shared/filters/validation.filter'
import { TransformInterceptor } from './shared/interceptors/response-transform.interceptor'

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
	app.useGlobalInterceptors(new TransformInterceptor())
	app.useGlobalFilters(new ValidationFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			skipMissingProperties: false,
			exceptionFactory: (errors: ValidationError[]) => {
				const errMsg = {}
				errors.forEach((err) => {
					errMsg[err.property] = [...Object.values(err.constraints)]
				})
				return new ValidationException(errMsg)
			}
		})
	)

	const { host, port } = app.get(ConfigService).get<RestApiConfig>('server.restApi')

	await app.listen(port, host)
}

bootstrap()
