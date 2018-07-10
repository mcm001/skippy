// Load in system libraries
const fs = require('fs');

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./credentials.json");
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
    client.guilds.get('448951856660480030').fetchAuditLogs()
        .then(audit => console.log(audit.entries.first()))
});

client.on('message', async message => {
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
        if(!message.member.roles.some(r=>["admin", "Moderator"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");       

        // This command removes all messages from all users in the channel, up to 100.
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        client.channels.get('463208192013369354').send(`${message.author.tag} has used the prune command to delete ${deleteCount} messages.`)

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
})
/* client.on('messageUpdate', async message => {
    console.log('#' + message.channel.name
        + '|' + message.member.displayName + ': '
        + message.content + ' (updated)'
        + '\n' + message.edits
    );
}) */

client.on("messageDelete", async messageDelete => {
    console.log(messageDelete);
    console.log(`#${messageDelete.channel.name} | ${messageDelete.member.displayName}: ${messageDelete.content} (deleted)`);
    client.channels.get('463208192013369354').send(`The message : "${messageDelete.content}" by ${messageDelete.author.tag} was deleted by`)
});

client.on("messageDeleteBulk", bd => {
    for (var [s, m] of bd) {
        console.log(JSON.stringify(bd, undefined, 2));
        console.log('#' + m.channel.name + '|' + m.member.displayName + ': ' + m.content + ' (deleted)');
        client.channels.get('463208192013369354').send(`The message : "${m.content}" by ${m.author.tag} was deleted.`)
    }
});

// Watch for reactions and do things with them
/* client.on('messageReactionAdd', (messageReaction, user) => {
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
}); */

// Start the bot
client.login(config.token);
