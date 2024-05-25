const redis = require("redis");
const { promisify } = require("util"); // module nodejs
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const client = require("./redis.client.service");
// if order susscess throw key to another request to use (optimistic lock)

const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10;
  const expireTime = 3000; // 3s lock

  for (let i = 0; i < retryTime; i++) {
    // have to retry 10 times to order
    // create key for payment
    const result = await setnxAsync(key, expireTime);
    const isReservation = await reservationInventory({
      cartId,
      productId,
      quantity,
    });
    if (result === 1) {
      if (isReservation.modifiedCount) {
        // modify success this count will positive
        await pexpire(key, expireTime); // expire this key for another user after 3 second
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
