#! /usr/bin/env node

"use strict";
let util = require('util');
let path = require('path');
let fs = require('fs');
let Transform = require('stream').Transform;
let args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
});
/**********/
let BASE_PATH =  path.resolve(
    process.env.BASE_PATH || __dirname
);

let OUTFILE = path.join(BASE_PATH, "out.txt")

if (args.help){
    printHelp()

} else if (
    args.in || 
    args._.includes("-")
){
    processFile(process.stdin)
        .catch(error)

} else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFile(stream)
        .then(()=> {console.log("\nFinish")})
        .catch(error);
} else {
    error("you must provide a value", true)
}

async function processFile(inStream) {
    let outStream = inStream;
    let UpperStream = new Transform({
        transform(chunck, enc, cb) {
            this.push(chunck.toString().toUpperCase());
            cb();  //next()
        }
    })
    outStream = inStream.pipe(UpperStream);
    let targetStream = args.out ? process.stdout : fs.createWriteStream(OUTFILE);
    outStream.pipe(targetStream);
    // to determine the end of stream
    await streamComplete(outStream); // will return a Promise
}

function streamComplete(stream) {
    return new Promise(function c(res){
        stream.on("end", res)
    })
}

function error(msg, includeHelp = false){
    console.error(msg);
    includeHelp && printHelp()
}

function printHelp() {
    console.log("ex3 usage:");
    console.log("ex3js --file={FILENAME}");
    console.log("");
    console.log("--help              print this help");
    console.log("--file={FILENAME}              process the file");
    console.log(" --in, -                                  Process stdin");
    console.log(" --out, -                                Print to stdout");
    console.log("");
}
// process.stdout.write("Hello World");
