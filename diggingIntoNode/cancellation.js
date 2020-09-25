#! /usr/bin/env node

"use strict";
/*
The point is that we're able to stop an asynchronous operation like a streaming operation
right in the middle of it.
instead of continuing to consume system resources 
unnecessarily
*/
let path = require('path');
let fs = require('fs');
let Transform = require('stream').Transform;
let args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
});
let CAF = require('caf');
processFile = CAF(processFile)
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
    let tooLong = CAF.timeout(30, "\nTook to long!");
    processFile(tooLong, process.stdin)
        .catch(error)

} else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    let tooLong = CAF.timeout(30, "\nTook to long!");
    processFile(tooLong, stream)
        .then(()=> {console.log("\nFinish")})
        .catch(error);
} else {
    error("you must provide a value", true)
}

function *processFile(signal, inStream) {
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
    //! signal  comes in with a promise on it 
    //- that is going to be rejected whenever whenever the cancellation is fired
    signal.pr.catch(function f() {
        outStream.unpipe(targetStream);
        outStream.destroy();
    });
    // to determine the end of stream
    yield streamComplete(outStream); // will return a Promise
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
