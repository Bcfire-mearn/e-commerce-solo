import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  brandId: { type: Number, required: true },
});

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand;