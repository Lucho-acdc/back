import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
 
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  products: [
    {
        id_prod: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }
  ]
});

const carts = mongoose.model('carts', cartSchema);
export default carts;