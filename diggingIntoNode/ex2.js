#! /usr/bin/env node

"use strict";
let util = require('util');
let path = require('path');
let fs = require('fs');
let Transform = require('stream').Transform;
// let getStdin = require('get-stdin');
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

} else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFile(stream);

} else {
    error("you must provide a value", true)
}

function processFile(inStream) {
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
}

function onContent(err, contents) {
    err && error(err.toString());
    !err &&processFile(contents)
}

function error(msg, includeHelp = false){
    console.error(msg);
    includeHelp && printHelp()
}

function printHelp() {
    console.log("app usage:");
    console.log("   app.js --file={FILENAME}");
    console.log("");
    console.log("--help              print this help");
    console.log("--file={FILENAME}              process the file");
    console.log(" --in, -                                  Process stdin");
    console.log(" --out, -                                Print to stdout");
    console.log("");
}
// process.stdout.write("Hello World");
