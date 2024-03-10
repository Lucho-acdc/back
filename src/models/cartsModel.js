import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
  products: [
    {
        id_prod: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'products'
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