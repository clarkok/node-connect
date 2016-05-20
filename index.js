'use strict';

let packet = require('node-packet');
let readline = require('readline');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let iface = 'eth0';
let dst_mac = '00:00:00:00:00:00';

if (process.argv.length > 2) {
    iface = process.argv[2];
}

console.log('bind to iface', iface);

packet.listen(iface, function (data) {
    console.log('captured packet of length', data.length);
});

rl.setPrompt(iface + '> ');
rl.prompt();

rl.on('line', (line) => {
    line = line.trim();
    let split = line.split(' ', 1);
    let command = split[0];
    let content = split[1] + '';
    switch (command) {
        case 'echo':
            packet.send(iface, content);
            break;
        case 'exit':
            process.exit();
            break;
        default:
            console.log('unrecognized inst');
            break;
    }
    rl.prompt();
});

