
const ProductQueryRequest = (req, res, next) => {


  try {
    const { ...product } = req.query;
    if (product.page && Number.isNaN(Number(product.page))) {
      throw new Error('page not valid: should be a number: such as page=1')
    }
    const skip = product.page ? 9 * (product.page - 1) : 0
    const limit = product.page ? 9 : Number.MAX_SAFE_INTEGER
    if (product.brand?.length > 0) {
      const brandArr = product.brand.split(';').map(each => {
        const brand = each.slice(0,5).toLowerCase()
        const number = each.slice(5,each.length)
        if(brand!=='brand'|| Number.isNaN(Number(number))){
          throw new Error('brand not valid: should end with number: such as brand=brand1;brand1')
        }
        return Number(number);
      })
      req.body.productBrandId = brandArr;
    }

    if (product.type?.length > 0) {
      const typeArr = product.type?.split(';').map(each => {
        const type = each.slice(0,4).toLowerCase()
        const number = each.slice(4,each.length)
        if (type!=='type'||Number.isNaN(Number(number))) {
          throw new Error('type not valid : should end with number: such type=type1')
        }
        return Number(number);
      })
      req.body.productTypeId = typeArr;
    }
    
    req.body.skip = skip;
    req.body.limit = limit;

  } catch (err) {
    return res.status(422).json({
      message: err.message,
    });
  }
  next();
};

export { ProductQueryRequest };
