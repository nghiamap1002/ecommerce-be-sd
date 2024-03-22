const mongoose = require("mongoose");
const os = require("os");
const _SECOND = 5000;

const countConnect = () => {
  const numConneection = mongoose.connections.length;
  console.log(`Number of connections:: ${numConneection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConneection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum number of connection base on number of core
    const maxConnection = numCore * 5;
    console.log(`Active connection: ${numConneection}`);
    console.log(`Memory Usage ${memoryUsage / 1024 / 1024} MB`);

    if (numConneection > maxConnection) {
      console.log("Connnection  overload detected");
    }
  }, _SECOND);
};

module.exports = {
  countConnect,
  checkOverload,
};
