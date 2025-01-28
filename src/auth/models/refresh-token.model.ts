import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
  collection: 'refresh-tokens',
})
export class RefreshToken {
  @Prop({ type: String, default: uuidv4, required: true })
  _id?: string;

  @Prop({ type: String, required: true })
  tokenHash: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Boolean, default: false })
  revoked: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
