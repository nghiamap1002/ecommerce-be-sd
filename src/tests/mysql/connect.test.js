const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "concobebe",
  database: "test",
  port: "8811",
});
const batchSize = 1;
const totalSize = 10;

let currentId = 1;

const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    console.log(i, "values");
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    pool.end((err) => {
      if (err) {
        console.log("Error occurred while running batch");
      } else {
        console.log("Connection pool closed");
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

  pool.query(sql, [values], async (err, res) => {
    console.log(values, "values");
    if (err) throw err;
    // console.log(`Inserted ${res.affectedRows} record`);
    await insertBatch();
  });
};

insertBatch().catch((err) => console.log(err, "err"));

// pool.query("SELECT * FROM test_table", (err, res) => {
//   if (err) throw err;

//   console.log(res, "res");
//   pool.end((err) => {
//     if (err) throw err;
//     console.log("connection closed");
//   });
// });
