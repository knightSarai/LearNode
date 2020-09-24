let EventEmitter = require('events').EventEmitter;
let util = require('util');

class User extends EventEmitter{
    constructor(name){
        super();
        this.name = name;
    }
    
}

// const User = function(name) {
//     this.name = name;
// }

// util.inherits(User, events.EventEmitter);

const ward = new User("ward");
const sarah = new User("sarah");
const knight = new User("knight");
const users = [ward, sarah, knight];

users.forEach(user => {
    user.on('speak', (msg) => {
        console.log(`${user.name} said: ${msg}`);
    });
});

knight.emit('speak', 'I Love them both')