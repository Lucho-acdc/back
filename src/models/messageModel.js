import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const message = mongoose.model('message', messageSchema);
export default message;