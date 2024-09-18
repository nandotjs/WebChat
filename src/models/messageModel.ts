import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

export interface IMessage extends Document {
  sender: IUser['_id'];
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;