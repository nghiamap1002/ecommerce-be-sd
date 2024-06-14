// above node v20 detenv is deprecated
// require("dotenv").config();

const app = require("./src/app");
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 3052;
console.log(process.env.NODE_ENV, "NODE_ENV");

const server = app.listen(PORT, () => {
  console.log(`WSV ecommerce run ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
});

// PROXY
// const express = require("express");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();

// const PORT = 3000;
// const HOST = "localhost";

// const API_URL = "https://jsonplaceholder.typicode.com";

// app.get("/status", (req, res, next) => {
//   res.send("This is a proxy service");
// });

// const proxyOptions = {
//   target: API_URL,
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api/posts": "/posts", // remove base path
//   },
// };

// const proxy = createProxyMiddleware(proxyOptions);

// app.use("/", proxy);

// app.listen(PORT, HOST, () => {
//   console.log(`Proxy Started at ${HOST}:${PORT}`);
// });
