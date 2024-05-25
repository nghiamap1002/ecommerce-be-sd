const { createClient } = require("redis");

class RedisPubSubService {
  constructor() {
    this.subcriber = redisClient.client;
    this.publisher = redisClient.client;
  }

  async publish(channel, message) {
    setTimeout(() => {
      return new Promise((resolve, reject) => {
        this.publisher.publish(channel, message, (err, reply) => {
          if (err) {
            reject(err);
          } else resolve(reply);
        });
      });
    }, 1000);
  }

  async subcribe(channel, callback) {
    this.subcriber.subscribe(channel);
    this.subcriber.on("message", (subcriberChannel, message) => {
      console.log(message, "message");
      if (channel === subcriberChannel) callback(channel, message);
    });
  }
}

module.exports = new RedisPubSubService();
