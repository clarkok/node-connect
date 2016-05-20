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
    console.log('\ncaptured packet of length', data.length);
    showPacket(data);
    rl.prompt(true);
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
            let time = Date.now();
            let size = sendFile(content);
            time = Date.now() - time;
            console.log('sent', size, 'bytes in', time, 'ms (', size / 1024 / time, 'MB/s)');
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
        packet.send(iface, dst_mac, new Buffer(content, offset, 1024));
        offset += 1024;
    }
    return content.length;
}

function showPacket(data) {
    let string = data.toString();
    let output = '';
    for (let i = 0; i < string.length; ++i) {
        if (string.charCodeAt(i) > 31 && string.charCodeAt(i) < 127) {
            output += string.charAt(i);
        }
        else {
            output += '.';
        }
    }
    console.log(output);
}
