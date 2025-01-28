import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
  collection: 'user-secrets',
})
export class UserSecret {
  @Prop({ type: String, default: uuidv4, required: true })
  _id?: string;
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  userId: string;
}

export const UserSecretSchema = SchemaFactory.createForClass(UserSecret);
