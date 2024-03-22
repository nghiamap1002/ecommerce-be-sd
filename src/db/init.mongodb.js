"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, name, port },
} = require("../configs/config.mongo");
const connectString = `mongodb://0.0.0.0:27017/shopDEV`;
// const connectString = `mongodb://0.0.0.0:27017/shopDEV`;
// const connectString = `mongodb://${host}:${port}`;

const MongoClient = require("mongodb").MongoClient;

console.log(connectString, "connectString");
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    //dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => console.log("Connected Mongodb Success Pro", countConnect()))
      .catch((error) => console.log("Error connect", error));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
