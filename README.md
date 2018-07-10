# pinbot
Discord.js bot for pinning and other actions controlled primarily by end users through reactions.

## Configuration
Pinbot can be configured by creating a `credentials.json` file in the root of the bot directory with the following contents:

```
{
    "token": "YOUR_BOT_TOKEN_HERE"
}
```

The above file is in `.gitignore` to prevent accidental push up to this repository. Same for `node_modules`, you will need to run `npm install` to pull down the dependencies after cloning this repository and before running the first time. After that, just run `node index.js` to start the bot!