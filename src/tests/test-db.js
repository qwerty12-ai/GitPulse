const pool = require("../database/db")

// check whether we can connect node.js to mysql database using the connection pool defined in db.js
async function test() {
    // used a select 1 command to test the connection swiftly which literally returns 1. If it works, the connection is healthy.
    const [rows] = await pool.query("SELECT 1");
    console.log(rows)
}

test();