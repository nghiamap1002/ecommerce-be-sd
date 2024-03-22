const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();
// console.log("processs", process.env);

//init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// morgan("combined") use for prod
// morgan("common")
// morgan("dev") don't display call method
// morgan("short") like the name
// morgan("tiny") defaul
//init db
require("./db/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();
//init routes
app.use("/", require("./routes"));

//handling error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  console.log(statusCode, "statusCode");
  return res.status(statusCode).json({
    code: statusCode,
    status: "error",
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
