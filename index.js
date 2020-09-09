const {
  Client,
  MessageEmbed,
  ClientApplication,
  Emoji,
  MessageReaction
} = require("discord.js");
const client = new Client();
require("dotenv").config();
const myHttp = require("https");
const querystring = require("querystring");
const myHttps = require("http");
let text = "";
let token = "";
let cardsArray = "";
const loginOptions = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

let listOfMessages = ["one", "two", "three"];

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
    token = JSON.parse(token);
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

client.on("messageReactionAdd", message => {
  //console.log(message.message.reactions.cache.get("👎").message.id);
  //console.log(message.message.reactions.cache.get("👍").message.id);
  let reactionOne = message.message.reactions.cache;
  console.log(message.message.content);
  if (reactionOne.has("↪")) {
    if (reactionOne.get("↪").message.id !== "746130077216931941") {
      console.log(
        reactionOne
          .get("↪")
          .users.cache.has(message.message.channel.recipient.id)
      );
      if (
        reactionOne
          .get("↪")
          .users.cache.has(message.message.channel.recipient.id)
      ) {
        message.message.edit("next");
      }
    }
  }

  if (reactionOne.has("👍")) {
    if (reactionOne.get("👍").message.id !== "746130077216931941") {
      if (
        reactionOne
          .get("👍")
          .users.cache.has(message.message.channel.recipient.id)
      ) {
        console.log("hello");
        message.message.channel.send(listOfMessages.shift()).then(message => {
          message.react("↪");
        });
        message.message.channel.send("Got it right?").then(message => {
          message.react("👍");
        });
        message.message.channel.send("I missed it").then(message => {
          message.react("👎");
        });
      }
    }
  }
});

client.on("message", async message => {
  if (message.content === "!ping") {
    // send back "Pong." to the channel the message was sent in
    let question2 =
      "\n Question: \n Removing reactions by user is not as straightforward as removing by [...] or removing all reactions. The API does not provide a method for selectively removing reactions of a user";
    //console.log(message.channel);
    message.channel.send(question2).then(message => {
      message.react("↪");
    });
    const embed = new MessageEmbed().setTitle("testembed");
    embed.addField("previous card", ":arrow_backward:", true);
    embed.addField("next card", ":arrow_forward:", true);
    embed.setDescription("card");
    //console.log(embed);
    const embed2 = {
      title: "Some title",
      fields: [
        {
          name: "Question",
          value:
            "Removing reactions by user is not as straightforward as removing by [...] or removing all reactions. The API does not provide a method for selectively removing reactions of a user"
        },
        {
          name: "\u200b",
          value:
            "Press the green apple to flip the card, then thumbs up or down"
        }
      ]
    };
    /*
    message.channel.send({ embed: question2 }).then(message => {
      message.react("🍎");
    });
*/
    message.channel.send("Got it right?").then(message => {
      message.react("👍");
    });
    message.channel.send("I missed it").then(message => {
      message.react("👎");
    });

    console.log(`${message.author.username}#${message.author.discriminator}`);
    //console.log(message);
    // console.log(embed);
  }
  if (message.content === "!back") {
    message.channel.send(text[0].arcadename);
  }
  if (message.content === "!cards") {
    //token = JSON.parse(token);
    let existOptions = {
      headers: {
        authorization: token.token
      }
    };
    myHttps.get(
      "http://localhost:5000/api/cards/flashcards",
      existOptions,
      res => {
        let answer = "";
        res.on("data", data => {
          answer += data;
        });
        res.on("end", () => {
          cardsArray = answer;
          console.log(cardsArray);
        });
      }
    );
  }
  if (message.content === "!login") {
    let uniqueUser = `${message.author.username}%23${
      message.author.discriminator
    }`;
    console.log(uniqueUser);
    //token = JSON.parse(token);
    console.log(token);
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
