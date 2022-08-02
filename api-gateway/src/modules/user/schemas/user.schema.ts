import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from '../enums/role.enum'

type UserDocument = User & Document

@Schema({ versionKey: false, id: true })
class User {
	@Prop({ required: true })
	name: string

	@Prop({ unique: true, required: true })
	username: string

	@Prop({ required: true, select: false })
	password: string

	@Prop({ required: true, default: Role.USER })
	role: string
}

const UserDatabaseName = 'users'
const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(require('mongoose-unix-timestamp'))

export { User, UserDocument, UserSchema, UserDatabaseName }
