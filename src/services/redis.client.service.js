const { createClient } = require("redis");

class RedisService {
  constructor() {
    this.connect();
  }

  async connect() {
    const client = createClient({});
    client.on("connect", () =>
      console.log("connect", new Date().toISOString())
    );
    client.on("ready", () => console.log("ready", new Date().toISOString()));
    client.on("error", (err) =>
      console.error("error", err, new Date().toISOString())
    );
    try {
      await client.connect();
      this.client = client;
    } catch (error) {
      console.error("connect err", err, new Date().toISOString());
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisService();
    }
    return this.instance;
  }
}

const instanceRedis = RedisService.getInstance();

// const instanceRedis =x;
module.exports = RedisService.instance.client;
