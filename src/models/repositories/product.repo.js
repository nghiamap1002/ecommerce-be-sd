const { Types } = require("mongoose");
const { productModel } = require("../product.model");
const { getSelectData, convertToObjectIdMongo } = require("../../utils");
const inventoryModel = require("../inventory.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByshop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const res = await foundShop.updateOne(foundShop);
  const { modifiedCount } = res;
  console.log(res, "publishProductByshop");
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const res = await foundShop.updateOne(foundShop);
  const { modifiedCount } = res;
  return modifiedCount;
};

const searchProductsByUser = async ({ keySearch }) => {
  const result = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: keySearch || "" },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select));
};

const findProductById = async ({ product_id, unSelect }) => {
  return await productModel
    .findById(product_id)
    .select(getSelectData(unSelect, 0));
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, {
    isNew,
  });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const getProductById = async (productId) => {
  return await productModel.findById(productId).lean();
};

const checkProductByServer = async (products) => {
  return Promise.all(
    products.map(async (p) => {
      const foundProduct = await getProductById(p.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: p.quantity,
          productId: p.productId,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByshop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProductById,
  updateProductById,
  getProductById,
  checkProductByServer,
};
