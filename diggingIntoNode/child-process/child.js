"use strict";

var fetch = require("node-fetch");


// ************************************

const HTTP_PORT = 8039;


main().catch(() => 1);


// ************************************

async function main() {
    let res;
    try {
        res = await fetch("http://localhost:8039/get-records");   
    } catch (err) {
        console.log(err);
    }
    if (res && res.ok) {
        let records = await res.json();
        if (records && records.length > 0) {
            process.exitCode = 0;
            return;
        }
    }
    process.exitCode = 1
    
}