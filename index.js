const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
require("dotenv").config();
const myHttp = require("https");

let text = "";

myHttp.get("https://wfgc-backend.herokuapp.com/api/arcades", res => {
  res.on("data", data => {
    text = JSON.parse(data);
  });
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", message => {
  if (message.content === "!ping") {
    // send back "Pong." to the channel the message was sent in
    message.channel.send("Pong.");
    const embed = new MessageEmbed().setTitle("testembed");
    message.channel.send(embed);
    message.channel.send(text[0].front);
  }
  if (message.content === "!back") {
    message.channel.send(text[0].arcadename);
  }
});

client.login(process.env.BOT_TOKEN);
