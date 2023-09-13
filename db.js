/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  console.log("test env")
  DB_URI = "postgresql:///biztime_test";
} else {
  console.log("real db attached")
  DB_URI = "postgresql:///biztime";
}


let db = new Client({
  connectionString: DB_URI
});

//testing
db.query('SELECT * FROM companies', function(err, result) {
    console.log(err)
  });

db.connect();

module.exports = db;