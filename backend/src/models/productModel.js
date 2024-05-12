import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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
  category: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
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

productSchema.plugin(paginate);
const product = mongoose.model('product', productSchema);
export default product;