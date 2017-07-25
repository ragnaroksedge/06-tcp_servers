'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('@shout', function(client, string) {
  string = string.toUpperCase();

  pool.forEach(c => {
    c.socket.write(`${client.nickname} shouts: ${string} \n`);
  });
});

ee.on('@wink', function(client) {
  pool.forEach(c => {
    c.socket.write(`${client.nickname} winks at ${c.nickname} \n`);
  });
});

ee.on('@whisper', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();

  pool.forEach(c => {
    if(c.nickname === nickname) {
      client.socket.write(`You whisper to ${c.nickname}: ${message} \n`);
      c.socket.write(`${client.nickname} whispers: ${message} \n`);
    }
  });
});

ee.on('@all', function(client, string) {
  pool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string} \n`);
  });
});

ee.on('@nickname', function(client, string) {
  client.nickname = string.split(' ').shift().trim();
});

ee.on('default', function(client) {
  client.socket.write('not a command \n');
});

ee.on('close', function(client) {
  client.socket.write(`${client.nickname} left the chat \n`);
});

ee.on('error', function(err) {
  console.error(err);
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, function() {
  console.log('server:', PORT);
});
