const redis = require("redis");
const { promisify } = require("util"); // module nodejs
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10;
  const expireTime = 3000; // 3s lock

  for (let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(result, "result");
    const isReservation = await reservationInventory({
      cartId,
      productId,
      quantity,
    });
    if (result === 1) {
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  releaseLock,
  acquireLock,
};
