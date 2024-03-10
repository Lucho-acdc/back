import mongoose from 'mongoose';

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
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  rol: {
    type: String,
    default: "User"
  }
});

const users = mongoose.model('users', userSchema);
export default users;
