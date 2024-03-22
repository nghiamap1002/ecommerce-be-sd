const discountController = require("../controllers/discount.controller");
const { BadRequestError } = require("../core/error.response");
const { orderModel } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shopOrderIds = [] }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart doesn't exist");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shopOrderIdsNew = [];

    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, shopDiscount = [], itemProducts = [] } = shopOrderIds[i];
      //   console.log(itemProducts, "itemProducts");
      const checkProductServer = await checkProductByServer(itemProducts);
      console.log(checkProductServer, "checkProductServer");
      if (!checkProductServer[0])
        throw new BadRequestError("Somethings went wrong with order");

      // total price
      const checkoutPrice = checkProductServer.reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
      }, 0);

      // price before discount
      checkoutOrder.totalPrice += checkoutPrice;
      const itemcheckout = {
        shopId,
        shopDiscount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProductServer,
      };

      // if discount exist  > 0
      if (shopDiscount.length > 0) {
        // if discount exist, get amount discount and use it
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscoutAmount({
            codeId: shopDiscount[0].codeId,
            shopId,
            userId,
            products: checkProductServer,
          });

        // total discount
        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemcheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemcheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemcheckout);
    }
    return {
      shopOrderIdsNew,
      shopOrderIds,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shopOderIdsNew,
    cartId,
    userId,
    userAddress = {},
    userPayment = {},
  }) {
    const { checkoutOrder, shopOrderIds, shopOrderIdsNew } =
      await this.checkoutReview({
        cartId,
        userId,
        shopOrderIds: shopOderIdsNew,
      });
    const products = shopOderIdsNew.flatMap((order) => order.itemProducts);
    console.log(products, "products");
    const productsV2 = shopOderIdsNew.map((order) => order.itemProducts);
    console.log(productsV2, "productsV2");
    const productsV3 = shopOderIdsNew.map((order) => order.itemProducts).flat();
    console.log(productsV3, "productsV3");

    const acquireProduct = [];

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock({ cartId, productId, quantity });
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if product is out of stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Few products is updated, plz refresh your cart"
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: userAddress,
      order_payment: userPayment,
      order_products: shopOrderIdsNew,
      //   order_status,
      //   order_trackingNumber,
    });

    // if insert success, remove product fron your cart
    if (newOrder) {
    }

    return newOrder;
  }

  static async;
}

module.exports = CheckoutService;
