const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`logged as ${client.user.tag}`);
});

const token =
  "MTIyMDYzMjI0ODYyNjE4ODM1OQ.G6H2Bb.yxqZ-l3cSzrWxuXFNL9CGFcUHNpd61JTlEG3oU";
client.login(token);

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "helu") msg.reply("con cho minh anh");
});
