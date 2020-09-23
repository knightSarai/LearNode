#! /usr/bin/env node

"use strict";
var util = require('util');
var path = require('path');
var fs = require('fs');
var getStdin = require('get-stdin');
var args = require("minimist")(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
});
/**********/
var BASE_PATH =  path.resolve(
    process.env.BASE_PATH || __dirname
);

if (args.help){
    printHelp()

} else if (
    args.in || 
    args._.includes("-")
){
    getStdin().then(processFile).catch(error);

} else if (args.file) {
    fs.readFile(path.join(BASE_PATH, args.file), onContent);   

} else {
    error("you must provide a value", true)
}

function processFile(contents) {
    process.stdout.write(
        contents.toString()
        .toUpperCase()
    )
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
    console.log("");
}
// process.stdout.write("Hello World");
