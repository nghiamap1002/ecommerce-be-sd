const mongoose = require("mongoose");

const connectString =
  "mongodb+srv://next-ecom:Nmap123456@cluster0.3mgeguf.mongodb.net/bookstore?retryWrites=true&w=majority";

mongoose
  .connect(connectString)
  .then(() => console.log("Connected Mongodb Success"))
  .catch((error) => console.log("Error connect"));

module.exports = mongoose;
