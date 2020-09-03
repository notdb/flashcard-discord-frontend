const { Client, MessageEmbed, ClientApplication } = require("discord.js");
const client = new Client();
require("dotenv").config();
const myHttp = require("https");
const querystring = require("querystring");
const myHttps = require("http");
let text = "";
let token = "";

const loginOptions = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

const postData = JSON.stringify({
  username: process.env.USER_NAME,
  password: process.env.PASSWORD
});

const req = myHttps.request(loginOptions, res => {
  console.log(`Status: ${res.statusCode}`);
  res.setEncoding("utf8");

  res.on("data", chunk => {
    token += chunk;
  });
  res.on("end", () => {
    console.log("No more data in response");
  });
});

req.write(postData);
req.end();
console.log(token + " poo");
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
    let uniqueUser = `${message.author.username}%23${
      message.author.discriminator
    }`;
    console.log(uniqueUser);
    token = JSON.parse(token);
    let existOptions = {
      headers: {
        authorization: token.token
      }
    };
    myHttps.get(
      `http://localhost:5000/api/auth/exists?user=${uniqueUser}`,
      existOptions,

      res => {
        let answer = "";
        res.on("data", data => {
          answer += data;
        });

        res.on("end", () => {
          let pars;
          if (JSON.parse(answer).message == 1) {
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
