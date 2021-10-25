/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require("mongodb");

const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = "mongodb://localhost:37017/maxcoin";
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.client = await mongoClient.connect();
    this.collection = this.client.db("maxcoin").collection("values");
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];
    Object.entries(data.bpi).forEach((result) => {
      documents.push({
        date: result[0],
        value: result[1],
      });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { value: -1 } });
  }

  async max() {
    console.info("Connection to MongoDB");
    console.time("mongodb-connect");
    try {
      await this.connect();
    } catch (error) {
      console.log("MongoDB connection failure.");
    }
    console.log("MongoDB connection succuss.");
    console.timeEnd("mongodb-connect");

    console.info("\nInserting into MongoDB");
    console.time("mongodb-insert");
    const inserResult = await this.insert();
    console.timeEnd("mongodb-insert");
    console.info(`${inserResult.insertedCount} documents were inserted.`);

    // Find max
    console.info("\nQuerying mongoDB");
    console.time("mongodb-find");
    const doc = await this.getMax();
    console.timeEnd("mongodb-find");

    // Disconnect from the database and time it
    console.info("\nDisconnection to MongoDB");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");
    console.log("");

    return {
      date: doc.date,
      value: doc.value,
    };
  }
}

module.exports = MongoBackend;
