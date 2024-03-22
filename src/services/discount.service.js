const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExist,
  findAllDiscountCodeSelect,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongo } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      startDate,
      endDate,
      isActive,
      shopId,
      minOrderValue,
      productIds,
      applyTo,
      name,
      description,
      type,
      value,
      maxValue,
      maxUses,
      useCount,
      usersUsed,
      maxUsesPerUser,
    } = payload;

    //check date
    if (new Date(startDate) < new Date() || new Date() > new Date(endDate))
      throw new BadRequestError("Date is invalid");

    if (new Date(startDate) >= new Date(endDate))
      throw new BadRequestError("Start date must be less than end date");

    //create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exist!");
    }

    const newDiscount = await discountModel.create({
      discount_apply_to: applyTo,
      discount_code: code,
      discount_description: description,
      discount_is_active: isActive,
      discount_max_uses: maxUses,
      discount_max_uses_per_user: maxUsesPerUser,
      discount_min_order_value: minOrderValue || 0,
      discount_name: name,
      discount_product_ids: applyTo === "all" ? [] : productIds,
      discount_shopId: shopId,
      discount_type: type,
      discount_use_count: useCount,
      discount_uses_used: usersUsed,
      discount_start_date: new Date(startDate),
      discount_end_date: new Date(endDate),
      discount_value: value,
    });

    return newDiscount;
  }

  static async updateDiscount() {}

  static async getAllDiscountWithProductId({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new BadRequestError("Discount not exists!");

    const { discount_apply_to, discount_product_ids } = foundDiscount;
    let product;
    if (discount_apply_to === "all") {
      product = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongo(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime", // most recently
        select: ["product_name"],
      });
    }
    if (discount_apply_to === "specific") {
      product = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime", // most recently
        select: ["product_name"],
      });
    }
    return product;
  }

  static async getAllDiscountByShop({ limit, page, shopId }) {
    const discount = await findAllDiscountCodeSelect({
      limit: limit,
      page: page,
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_is_active: true,
      },
      select: ["discount_code", "discount_name"],
      model: discountModel,
    });
    return discount;
  }

  static async getDiscoutAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongo(shopId),
      },
      model: discountModel,
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist");

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_end_date,
      discount_start_date,
      discount_uses_used,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount has expried");
    if (!discount_max_uses) throw new NotFoundError("Discount is out of turn");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BadRequestError("Discount has expired");

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount require a minimum order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_uses_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleteDiscount = await discountModel.findOneAndDelete({
      discount_shopId: shopId,
      discount_code: convertToObjectIdMongo(codeId),
    });
    return deleteDiscount;
  }

  static async verifyDiscount() {}

  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const discount = await checkDiscountExist({
      filter: {
        discount_code: convertToObjectIdMongo(codeId),
        discount_shopId: shopId,
      },
      model: discountModel,
    });

    if (!discount) throw new NotFoundError("Discount doesn't exist");
    return await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_uses_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_use_count: -1,
      },
    });
  }
}

module.exports = DiscountService;
