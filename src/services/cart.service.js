const { getProductById } = require("../models/repositories/product.repo");
const { cartModel } = require("../models/cart.model");
const _ = require("lodash");
const {
  convertToObjectIdMongo,
  getIntoData,
  unGetIntoData,
} = require("../utils");
const { NotFoundError } = require("../core/error.response");

class CartService {
  static async createUserCart({ userId, products }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };

    const updateOrInsert = {
      $addToSet: {
        cart_products: products,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, products }) {
    const { productId, quantity } = products;
    const query = {
      cart_userId: userId,
      cart_state: "active",
      "cart_products.productId": productId,
    };

    const updateOrInsert = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addToCart({ userId, products = {} }) {
    const userCart = await cartModel.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      //   return unGetIntoData(await this.createUserCart({ userId, products }), [
      //     "__v",
      //     "cart_state",
      //   ]);
      const newCart = unGetIntoData(
        await this.createUserCart({ userId, products }),
        // {
        //   _id: "64f55fc4a160420b1927556d",
        //   cart_state: "active",
        //   cart_userId: 1001,
        //   __v: 0,
        //   cart_count_product: 0,
        //   cart_products: [
        //     {
        //       productId: "64f0580e943e284f0ecf7451",
        //       shopId: "64ec31c5465adb30e0990f03",
        //       quantity: 1,
        //     },
        //   ],
        // },
        ["__v"]
      );
      return newCart;
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [products];
      return await userCart.save();
    }

    return await this.updateUserCartQuantity({ userId, products });
  }

  static async updateCart({ userId, shopOrderIds = {} }) {
    const { productId, quantity, oldQuantity, shopId } =
      shopOrderIds[0]?.itemProducts[0];
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product doesn't exist");
    if (foundProduct.product_shop.toString() !== shopId)
      throw new NotFoundError("Product doesn't belong to the shop");
    if (quantity === 0) {
    }

    return await this.updateUserCartQuantity({
      userId,
      products: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteProudctIntoCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    return await cartModel.updateOne(query, updateSet);
  }

  static async getListUserCart({ userId }) {
    return unGetIntoData(
      await cartModel
        .findOne({
          cart_userId: userId,
        })
        .lean(),
      ["__v"]
    );
  }
}

module.exports = CartService;
