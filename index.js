const { Client, MessageEmbed, ClientApplication } = require("discord.js");
const client = new Client();
require("dotenv").config();
const myHttp = require("https");
const myHttps = require("http");
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
    console.log(`${message.author.username}#${message.author.discriminator}`);
    console.log(message);
  }
  if (message.content === "!back") {
    message.channel.send(text[0].arcadename);
  }
  if (message.content === "!login") {
    let uniqueUser = `${message.author.username}#${
      message.author.discriminator
    }`;
    myHttps.get(
      `http://localhost:5000/api/auth/exists?user=${uniqueUser}`,
      res => {
        res.on("data", data => {
          let answer = JSON.parse(data);
          console.log(answer);
          if (answer.message == 1) {
            message.channel.send(`already logged in`);
          } else {
            message.channel.send(
              `Login with https://localhost:5000/api/login?user=${uniqueUser}`
            );
          }
        });
      }
    );
  }
});

client.login(process.env.BOT_TOKEN);
