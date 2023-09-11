/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

DB_URI = "postgresql:///biztime";


let db = new Client({
  connectionString: DB_URI
});

db.query('SELECT * FROM companies', function(err, result) {
    console.log("test")
 
    console.log(err)
  });

db.connect();

module.exports = db;