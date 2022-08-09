import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Factory } from 'nestjs-seeder'
import { getNow } from '../../../shared/utils/functions'
import { Role } from '../enums/role.enum'
import { User as IUser } from '../interfaces/user.interface'

type UserDocument = User & Document

@Schema({ versionKey: false, id: true })
class User implements IUser {
	@Factory('Admin')
	@Prop({ required: true })
	name: string

	@Factory('Admin')
	@Prop({ unique: true, required: true })
	username: string

	@Factory('PassGodratmand')
	@Prop({ required: true, select: false })
	password: string

	@Factory('Admin')
	@Prop({ required: true, default: Role.USER })
	role: string

	@Factory(getNow())
	created_at: number

	@Factory(getNow())
	updated_at: number
}

const UserDatabaseName = 'users'
const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(require('mongoose-unix-timestamp'))

export { User, UserDocument, UserSchema, UserDatabaseName }
