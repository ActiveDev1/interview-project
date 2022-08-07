export interface Request<T> {
	action: string
	data: T
	namespace?: string
}
