import { ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { RestApiConfig } from './config/configuration'
import { ValidationException, ValidationFilter } from './shared/filters/validation.filter'
import { TransformInterceptor } from './shared/interceptors/response-transform.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
const SWAGGER_ENVS = ['development', 'local']

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

	if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
		const configDocument = new DocumentBuilder()
			.setTitle('UserManagment Service')
			.setDescription('The UserManagment APIs document')
			.setVersion('1.0')
			.addBearerAuth(
				{
					description: `Please enter access token in following format: Bearer <JWT>`,
					name: 'Authorization',
					bearerFormat: 'Bearer',
					scheme: 'Bearer',
					type: 'http',
					in: 'Header'
				},
				'access-token'
			)
			.addBearerAuth(
				{
					description: `Please enter refresh token in following format: Bearer <JWT>`,
					name: 'Authorization',
					bearerFormat: 'Bearer',
					scheme: 'Bearer',
					type: 'http',
					in: 'Header'
				},
				'refresh-token'
			)
			.build()
		const document = SwaggerModule.createDocument(app, configDocument)
		SwaggerModule.setup('api-doc', app, document)
	}

	const { host, port } = app.get(ConfigService).get<RestApiConfig>('server.restApi')

	await app.listen(port, host)
}

bootstrap()
