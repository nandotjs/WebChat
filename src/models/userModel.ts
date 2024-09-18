import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Criptografa a senha antes de salvar
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  const user = this as IUser;
  return await bcrypt.compare(enteredPassword, user.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
