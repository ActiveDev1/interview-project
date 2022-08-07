import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from '../enums/role.enum'
import { User as IUser } from '../interfaces/user.interface'

type UserDocument = User & Document

@Schema({ versionKey: false, id: true })
class User implements IUser {
	@Prop({ required: true })
	name: string

	@Prop({ unique: true, required: true })
	username: string

	@Prop({ required: true, select: false })
	password: string

	@Prop({ required: true, default: Role.USER })
	role: string

	created_at: number

	updated_at: number
}

const UserDatabaseName = 'users'
const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(require('mongoose-unix-timestamp'))

export { User, UserDocument, UserSchema, UserDatabaseName }
