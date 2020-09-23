const http = require('http');

//* we don't know when the inbound request would come - we have to rely on Node to trigger JS code to run.
//* Node not only will auto-run our function at the right moment, it will also automatically insert whatever the relevent data is the argument (input).
//- even insert a set of functions in an object (as an argment) which give us direct access to the message (in Node), being sent back to the user and allows us
//- to add more data to that message.

//*Node will create Two objects for us.
//! without lablel, we give them the label we want, like (req, res)
//- will packedge the important infromation from the unbound message, and automatically insert it to excution context:
//- the middleware pattern just says take the object that created by node and pass it to function throw function throw function
//- .. doing something to it at each stage and the return it back out.

//! the data that passed from the computer to node, will be transfered As buffer.

const tweets = ['knight tweet', 'sarah tweet', 'ward tweet'];

function onIncomingData(req, res) {
    const tweetIdx = req.url.slice(8) - 1;
    if( req.method === 'GET' ) {
        console.log('incoming data');
    }
    res.end(tweets[tweetIdx]);
};

function doOnError(err) {
    console.error(err);
}

//- auto run (onInComingData), when activity.
const server = http.createServer(onIncomingData);
//- the object that contains method (on) is javascript  output of running (createServer).
//* the javascript output object, with its methods allow me to interact with node internals and modifiy node behavior.
//- the c++ output of running (create server ) is setting up the socket
server.listen(8000);
// request, clientError: are masseages  that built into node.
server.on('request', onIncomingData);
server.on('clientError', doOnError);
