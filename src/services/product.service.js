const { ELECTRONICS, FUNITURE, CLOTHING } = require("../constant");
const { BadRequestError } = require("../core/error.response");
const {
  clothingModel,
  electronicModel,
  productModel,
  funitureModel,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByshop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProductById,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { pushNotification } = require("./notification.service");

class ProductFactory {
  static ProductRegistry = {};

  static registerProductType(type, classRef) {
    this.ProductRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.ProductRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = this.ProductRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByshop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // FIND
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async searchProducts(keySearch) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      filter,
      limit,
      page,
      sort,
      select: [
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ],
    });
  }

  static async findProductById({ product_id }) {
    return await findProductById({ product_id, unSelect: ["__v"] });
  }
}

//base product class
class ProductService {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(productId) {
    const newProduct = await productModel.create({ ...this, _id: productId });
    if (newProduct) {
      await insertInventory({
        productId,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
      pushNotification({
        type: "SHOP-001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({
      payload,
      productId,
      model: productModel,
    });
  }
}

class ClothingService extends ProductService {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create New Clothing Error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }

  async updateProduct(productId) {
    // console.log(this,'this');
    const newObject = removeUndefinedObject(this);
    console.log(newObject, "newObject");
    if (newObject.product_attributes) {
      await updateProductById({
        payload: updateNestedObjectParser(newObject.product_attributes),
        productId,
        model: clothingModel,
      });
    }
    return await super.updateProduct(
      productId,
      updateNestedObjectParser(newObject)
    );
  }
}

class ElectronicService extends ProductService {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create New Electronic Error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }

  async updateProduct(productId, payload) {
    if (this.product_attributes) {
      await updateProductById({ payload, productId, model: electronicModel });
    }
    return await super.updateProduct(productId, payload);
  }
}

class FunitureService extends ProductService {
  async createProduct() {
    const newFuniture = await funitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFuniture) throw new BadRequestError("Create New Electronic Error");

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error");

    return newProduct;
  }

  async updateProduct(productId, payload) {
    if (this.product_attributes) {
      await updateProductById({ payload, productId, model: funitureModel });
    }
    return await super.updateProduct(productId, payload);
  }
}

ProductFactory.registerProductType(ELECTRONICS, ElectronicService);
ProductFactory.registerProductType(CLOTHING, ClothingService);
ProductFactory.registerProductType(FUNITURE, FunitureService);

module.exports = ProductFactory;
