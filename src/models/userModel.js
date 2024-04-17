import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  },
  role: {
    type: String,
    default: "user"
  }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Comparar contraseñas para autenticación
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
