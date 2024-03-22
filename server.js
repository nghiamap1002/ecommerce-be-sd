require("dotenv").config();

const app = require("./src/app");
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 3052;

const server = app.listen(PORT, () => {
  console.log(`WSV ecommerce run ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit server express"));
// });
