import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  code: {
      type: String,
      required: true,
      unique: true
  },
  thumbnail: {
      default: []
  },
  price: {
    type: Number,
    required: true
  },
});

const product = mongoose.model('product', productSchema);
export default product;