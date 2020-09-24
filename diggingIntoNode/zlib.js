#! /usr/bin/env node

"use strict";
let util = require('util');
let path = require('path');
let fs = require('fs');
let Transform = require('stream').Transform;
let zlib = require('zlib');
// let getStdin = require('get-stdin');
let args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in", "compress", "uncompress"],
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
    let upperStream = new Transform({
        transform(chunck, enc, cb) {
            this.push(chunck.toString().toUpperCase());
            cb();  //next()
        }
    })
    outStream = outStream.pipe(upperStream);
    if(args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
        
    }

    if (args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream)
        OUTFILE = `${OUTFILE}.gz`
    }
 
    let targetStream = args.out ? process.stdout : fs.createWriteStream(OUTFILE);
    outStream.pipe(targetStream);
}


function error(msg, includeHelp = false){
    console.error(msg);
    includeHelp && printHelp()
}

function printHelp() {
    console.log("app usage:");
    console.log("app.js --file={FILENAME}");
    console.log("");
    console.log("--help              print this help");
    console.log("--file={FILENAME}              process the file");
    console.log(" --in, -                                  Process stdin");
    console.log(" --out, -                                Print to stdout");
    console.log(" --compress, -                                gzip the output");
    console.log(" --uncompress, -                                unzip the output");
    console.log("");
}
