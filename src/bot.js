// require("dotenv").config();

const User = require("../models/user");
const Keyword = require("../models/keyword");

const linkKelas = require("./data");

const { Client } = require("discord.js");
const client = new Client();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_BOT1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) =>
    client.on("ready", () => {
      console.log(`${client.user.tag} has logged in`);
    })
  )
  .catch((err) => console.log(err));

const PREFIX = "!";

//detector
client.on("message", (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const cmd = message.content.trim().substring(PREFIX.length).toLowerCase();
    switch (cmd) {
      case "pk":
        User.find({})
          .sort({
            count: -1,
          })
          .then((documents) => {
            const board = ["PK LEADERBOARD"];

            documents.map((doc, index) => {
              board.push(`#${index + 1}  <@${doc.dcId}>(${doc.count})`);
            });

            message.channel.send(board.join("\n"));
          });
        break;
      case "link":
        const printedLinks = ["Link Kelas"];
        linkKelas.map((link) => {
          printedLinks.push(`[${link.mask}](${link.url})`);
        });
        message.channel.send(printedLinks.join("\n"));
    }
  }

  if (message.content.startsWith("~")) {
    const key = new Keyword({
      word: message.content.trim().substring(PREFIX.length).toLowerCase(),
    });
    key.save(key);
  }

  Keyword.find({}).then((docs) => {
    docs.map(({ word: keyword }) => {
      if (message.content.toLowerCase().includes(keyword)) {
        userId = message.author.id;
        message.channel.send(
          `${message.author} said ${keyword}, type !pk to see PK leaderboard`
        );

        User.findOneAndUpdate(
          { dcId: userId },
          { $inc: { count: 1 }, dcId: userId },
          { upsert: true }
        )
          .then((res) => {})
          .catch((err) => console.log(err));
      }
    });
  });
});

client.login(process.env.PKMETER_TOKEN);
