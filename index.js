const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

fs.readFile('credentials.json', (err, data) => {
    if (err) throw err;
    credentials = JSON.parse(data);
    client.login(credentials.token);
});