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
    switch (line.trim()) {
        case 'echo':
            rl.question('What to echo?', (answer) => packet.send(iface, dst_mac, line));
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

