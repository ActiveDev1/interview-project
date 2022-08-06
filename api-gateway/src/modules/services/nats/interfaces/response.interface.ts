type Error = {
	name: string
	message: string
	nodeID: string
	code: number
	retryable: boolean
	stack: string
	type: string
}

export interface Response<T> {
	id: string
	error: Error | undefined
	meta: object
	success: boolean
	data: T | null
	ver: string
	sender: string
}
