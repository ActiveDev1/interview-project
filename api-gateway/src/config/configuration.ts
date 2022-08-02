export interface RestApiConfig {
	host: string
	port: number
	logger: boolean
	prettyLogger: boolean
}

export default () => ({
	server: {
		restApi: {
			host: process.env.REST_HOST,
			port: +process.env.REST_PORT,
			logger: !!+process.env.REST_LOGGER,
			prettyLogger: !!+process.env.REST_PRETTY_LOGGER
		} as RestApiConfig
	}
})
