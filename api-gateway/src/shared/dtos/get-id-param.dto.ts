import { IsMongoId } from 'class-validator'

export class GetIdParam {
	@IsMongoId()
	id: string
}
