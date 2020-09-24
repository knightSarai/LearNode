let fs = require('fs');
let path = require('path');
let minimist = require("minimist");

let args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file']
})

let BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

let OUTFLIE = path.join(BASE_PATH, 'out.txt')
if (args.help) {
    printHelp()
}

let myReadStream = fs.createReadStream(path.join(BASE_PATH, args.file), 'utf-8');
let myWriteSteam = fs.createWriteStream(OUTFLIE);

// myReadStream.on('data', (chunk) => {
//     myWriteSteam.write(chunk)
// })

//- PIPE
// we pipe from read stream to writble stream
myReadStream.pipe(myWriteSteam)

function printHelp() {
    console.log("app usage:");
    console.log("");
    console.log("--help             print this help");
}