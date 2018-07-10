// Load in system libraries
const fs = require('fs');

// Load in third party libraries
const Discord = require('discord.js');
const client = new Discord.Client();

// Display a ready message after ready event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Watch for reactions and do things with them
client.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction.emoji.name == '📌') {
        if (messageReaction.count >= 3) {
            messageReaction.message.pin()
            .then(console.log(`${messageReaction.message.id} pinned!`))
            .catch(console.error);
        } else {
            console.log(`Message ID ${messageReaction.message.id} pushpin reaction count at ${messageReaction.count}. 3 needed for message to be pinned.`)
        }
    }
});

// Read the file credentials.json, and login
fs.readFile('credentials.json', (err, data) => {
    if (err) throw err;
    credentials = JSON.parse(data);
    client.login(credentials.token);
});