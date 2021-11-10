/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const Redis = require("ioredis");
const CoinAPI = require("../CoinAPI");

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  connect() {
    this.client = new Redis(6969);
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];
    Object.entries(data.bpi).forEach((result) => {
      values.push(result[1]);
      values.push(result[0]);
    });
    return this.client.zadd("maxcoin:values", values);
  }

  async getMax() {
    return this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES");
  }

  async max() {
    console.info("Connection to Redis");
    console.time("redis-connect");
    try {
      this.connect();
    } catch (error) {
      console.log("Redis connection failure.");
    }
    console.log("Redis connection succuss.");
    console.timeEnd("redis-connect");

    console.info("Inserting into Redis");
    console.time("redis-insert");
    const inserResult = await this.insert();
    console.timeEnd("redis-insert");
    console.info(`${inserResult} documents were inserted.`);

    // Find max
    console.info("Querying Redis");
    console.time("mongodb-find");
    const max = await this.getMax();
    console.timeEnd("mongodb-find");

    // Disconnect from the database and time it
    console.info("Disconnection to Redis");
    console.time("redis-disconnect");
    await this.disconnect();
    console.timeEnd("redis-disconnect");

    return max;
  }
}

module.exports = RedisBackend;
