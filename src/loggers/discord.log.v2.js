const { Client, GatewayIntentBits } = require("discord.js");

class LoggerService {
  constructor() {
    this.client = this.connectDiscord();
    this.token = process.env.TOKEN_DISCORD;
    this.channelID = process.env.CHANNEL_DISCORD_ID;
    this.client.on("ready", () => {
      console.log(
        process.env.CHANNEL_DISCORD_ID,
        "process.env.CHANNEL_DISCORD_ID"
      );
      console.log(`logged as ${this.client.user.tag}`);
    });
    this.client.login(this.token);
  }

  connectDiscord = () => {
    return new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  };

  sendToMessage = (msg = "hello") => {
    const channel = this.client.channels.cache.get(this.channelID);
    if (!channel) {
      console.error(`Not found this channel`);
      return;
    }

    channel.send(msg).cache((e) => console.error(e));
  };
}

const loggerService = new LoggerService();

module.exports = loggerService;