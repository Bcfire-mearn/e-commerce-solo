import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pictureUrl: { type: String },
  // productTypeId: { type: refType, ref: 'Type' },
  // productBrandId: { type: refType, ref: 'Brand' },
  productTypeId: { type: Number },
  productBrandId: { type: Number },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
