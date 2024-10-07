import Product from '../models/Product.js';
import User from '../models/User.js';


const getProduct = async (req, res) => {
  // get credentials from body
  const { skip, limit, productTypeId, productBrandId } = req.body;
  try {
    const query = {};
    if (typeof productTypeId !== 'undefined') {
      query.productTypeId = productTypeId;
    }

    if (typeof productBrandId !== 'undefined') {
      query.productBrandId = productBrandId;
    }

    let products = await Product.find(query).skip(skip).limit(limit).lean().exec();
    let Maxproducts = await Product.find(query).lean().exec();
    // send token in response
    let totalPages = Math.ceil(Maxproducts.length / 9)
    return res.status(200).json({ page: req.query.page, length: products.length, totalPages, products, statusCode: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};
const getProductById = async (req, res) => {
  // get credentials from body
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).lean().exec();
    if (!product) {
      return res.status(404).json({ message: "Product doesn't exist" })
    }
    const otherProduct = await Product.find({ productBrandId: product.productBrandId }).lean().exec();

    return res.status(200).json({ product, otherProduct, statusCode: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};

const addToList = async (req, res) => {
  // get credentials from body
  const { productId, userId } = req.body;
  try {
    const product = await Product.findById(productId).lean().exec();
    if (!product) {
      return res.status(404).json({ message: "Product doesn't exist" })
    }
    const user = await User.findById(userId).populate('favorites')
      .exec();;
    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" })
    }
    const favoriteExist = user.favorites.some(favorite => favorite._id.equals(product._id));

    if (favoriteExist) {
      // unfollow 
      user.favorites = user.favorites.filter(favorite => !favorite._id.equals(product._id));
      await user.save();
      const favoriteIds = user.favorites.map(fav => fav._id)
      return res.status(200).json({ message: "Unfollowed success", favorites: user.favorites, favoriteIds, product });
    } else {
      // Folow
      user.favorites.push(product)
      await user.save();
      const updatedUser = await User.findById(userId)
        .populate('favorites')
        .exec();
      const favoriteIds = updatedUser.favorites.map(fav => fav._id)
      return res.status(200).json({ message: "Followed success", favorites: updatedUser.favorites, favoriteIds, product });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, statusCode: 500 });
  }
};


export { getProduct, getProductById, addToList };
