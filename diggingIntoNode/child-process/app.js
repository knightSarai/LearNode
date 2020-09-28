#!/usr/bin/env node

"use strict";

var util = require("util");
var childProc = require("child_process");
const { resolve } = require("path");


// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 250;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************



async function main() {
    console.log(`Load testing http://localhost:${HTTP_PORT}...`);
    console.log(`Request ${MAX_CHILDREN} child`);
    while(true) {
        let childrens = [];
        for (let i = 0; i < MAX_CHILDREN; i++) {
            childrens.push(childProc.spawn('node', ['child.js']));
        }
        let resps = childrens.map(child => {
            return new Promise((res) => {
                child.on('exit', code => {
                    code === 0  && res(true);
                    res(false);
                });
            })
            
        })
        resps = await Promise.all(resps);
        if (resps.filter(Boolean).length === MAX_CHILDREN){
            console.log("Success!")
        } else {
            console.log("Failuers.") 
        }
        await delay(500)
    } 
}


// async function main() {
//     console.log(`Load testing http://localhost:${HTTP_PORT}...`);
//     while(true) {
//         let allZero = true;
//         for (let i = 0; i <= MAX_CHILDREN; i++) {
//             let child = childProc.spawn("node", ["child.js"]);
//             child.on('exit', code => {
//                 !(code === 0) && (allZero = false)
//             });
//         }
//         allZero ? console.log("success!") : console.log("failure")
//         await delay(500)
//     } 
// }