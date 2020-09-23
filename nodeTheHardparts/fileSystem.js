const fs = require('fs');
//! All functions that sat to auto-run, don't share the same Queue.
//! Any function envolve I/O wich trigger events do share the same Queue.
//! the data that passed from the computer to node, will be transfered As buffer.
// The call stack, event loop and callback queue in Node
// - Call stack: JavaScript keeps track of what function is being run and where it was run from. 
// Whenever a function is to be run, it’s added to the call stack
// - Callback queue - any functions delayed from running (and run automatically by Node) 
//* there are a whole bunch of queues, and different functions set to autorun by Node will be put in different queues.
//are added to the callback queue when the background Node task has completed (or there’s been some activity like a request)
// - Event loop - Determines what function/code to run next from the queue(s)

function useImportedtweets(errorData, data){
    const tweets = JSON.parse(data);
    console.log(tweets.tweet1)
}

function notImmediately(){
    console.log("Run me last !")
}

function printHello(){
    console.log("Hello")
}

function blockFor500ms(){
    // Block JS thread DIRECTLY for 500 ms
    // With e.g. a for loop with 5m elements
}

setTimeout(printHello, 0);
fs.readFile('./tweets.json', useImportedtweets);
blockFor500ms();
console.log("Me first");
setImmediate(notImmediately); // give us control over putting stuff into another totally seperate queue
// we use it when we want to make sure that all IO work, at that point has been done.
// by using setImmediate that will (put) the associated function in the last queue.
