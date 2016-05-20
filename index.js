'use strict';

let packet = require('node-packet');
let readline = require('readline');
let fs = require('fs');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let iface = 'eth0';
let dst_mac = 'a1:b2:c3:d4:e5:f6';

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
    let content = line.slice(command.length).trim();
    switch (command) {
        case 'echo':
            packet.send(iface, dst_mac, content);
            break;
        case 'file':
            sendFile(content);
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

function sendFile(path) {
    console.log('sending:', path);
    let content = fs.readFileSync(path);
    let offset = 0;
    while (offset < content.length) {
        console.log('sending from', offset);
        packet.send(iface, dst_mac, content.slice(offset, 1024));
        offset += 1024;
    }
}
