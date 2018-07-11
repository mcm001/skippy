// Load in system libraries
const fs = require('fs');

// set config folder  for docker environment
if (process.env.DOCKER === 'YES')
    process.env.CONFIGFOLDER = "/config/";
else
    process.env.CONFIGFOLDER = "./";

// Here we load the config.json file that contains our token and our prefix values. 
const config = require(process.env.CONFIGFOLDER + "config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// Load in third party libraries
const Discord = require('discord.js');
const client = new Discord.Client();
// Display a ready message after ready event


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
    if (config.homeserver) {
        client.guilds.get(config.homeserver).fetchAuditLogs()
            .then(audit => console.log(audit.entries.first()));
    }
});

/* client.on('message', async message => {
    console.log('#' + message.channel.name + '|' + message.member.displayName + ': ' + message.content);
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "prune") {
        if (!message.member.roles.some(r => ["admin", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        const user = message.mentions.users.first();
        const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])

        console.log(`User: ${user} | amount: ${amount}`)

        if (!amount) return message.reply('You didn\'t give me enough info! ```!purge [@user] <count>```');
        if (!amount && !user) return message.reply('You didn\'t give me enough info! ```!purge [@user] <count>```');

        if (config.logchannel) {
            client.channels.get(config.logchannel).send(`${message.author.tag} has used the prune command to delete ${amount} messages.`);
        }

        message.channel.fetchMessages({
            limit: !user ? amount : 100,
        }).then((messages) => {
            if (user) {
                const filterBy = user ? user.id : Client.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            }
            message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        });
    }
}) */

/* client.on('messageUpdate', async message => {
    console.log('#' + message.channel.name
        + '|' + message.member.displayName + ': 'als
        + message.content + ' (updated)'
        + '\n' + message.edits
    );
}) */

/* 
client.on("messageDelete", async messageDelete => {
    const thisserver = messageDelete.guild.id
    console.log(`Deleted from server: ${thisserver}`)
    client.guilds.get(thisserver).fetchAuditLogs()
        .then(audit => {
            console.log(messageDelete);
            console.log(`#${messageDelete.channel.name} | ${messageDelete.member.displayName}: ${messageDelete.content} (deleted)`);
            if (config.logchannel) {
                //client.channels.get(config.logchannel).send(`The message : "#${messageDelete.channel.name}:${messageDelete.content}" by ${messageDelete.author.tag} was deleted by ${audit.entries.first().executor.username}`)
                client.channels.get(config.logchannel).send(`The message : "#${messageDelete.channel.name}:${messageDelete.content}" by ${messageDelete.author.tag} was deleted.`)
            }
        });
})

client.on("messageDeleteBulk", bd => {
    for (var [s, m] of bd) {
        console.log('#' + m.channel.name + '|' + m.member.displayName + ': ' + m.content + ' (deleted)');
        if (config.logchannel) {
            client.channels.get(config.logchannel).send(`The message : "${m.channel.name}:${m.content}" by ${m.author.tag} was deleted.`)
        }
    }
});
*/

// Watch for reactions and do things with them
client.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction.emoji.name == '📌') {
        if (messageReaction.count >= 3) {
            if (messageReaction.message.pinned == false) {
                messageReaction.message.pin()
                .then(console.log(`Message ID ${messageReaction.message.id} pinned!`))
                .catch(console.error);
            }
        } else {
            console.log(`Message ID ${messageReaction.message.id} pushpin reaction count at ${messageReaction.count}. 3 needed for message to be pinned.`)
        }
    }
});

// Start the bot
client.login(config.token);
