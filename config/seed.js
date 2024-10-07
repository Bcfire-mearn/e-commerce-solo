import db from './connection.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import Type from '../models/Type.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path and directory name equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the file path
const filename = path.join(__dirname, 'seed.json');

// Read and parse data from seed.json
const typeData = JSON.parse(fs.readFileSync(filename, 'utf8')).types;
const brandData = JSON.parse(fs.readFileSync(filename, 'utf8')).brands;
const productData = JSON.parse(fs.readFileSync(filename, 'utf8')).products;

(async () => {
  try {
    await Promise.all([Brand.deleteMany(), Type.deleteMany(), Product.deleteMany()]);

    // const user = new User({ username: 'Will', password: '123456789', email: 'email@gmail.com' });
    // await user.save();
    const TypeInsertResult = await Type.insertMany(typeData)
    const BrandInsertResult = await Brand.insertMany(brandData)

    const typeMap = TypeInsertResult.reduce((map, type) => {
      map[type.typeId] = type._id;
      return map;
    }, {});

    const brandMap = BrandInsertResult.reduce((map, brand) => {
      map[brand.brandId] = brand._id;
      return map;
    }, {});

    const newPD = productData.map(product => {
      return {
        ...product,
        productTypeId: typeMap[product.productTypeId],
        productBrandId: brandMap[product.productBrandId]
      };
    });

    // const ProductInsertResult = await Product.insertMany(newPD)
    const ProductInsertResult = await Product.insertMany(productData)

    console.log('DB initialized');
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
  }
})();
