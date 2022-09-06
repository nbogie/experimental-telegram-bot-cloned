import bodyParser from "body-parser";
import express from "express";
import { Telegraf } from "telegraf";
/*
  TELEGRAM_BOT_TOKEN is an environment variable
  that should be configured on Railway
*/
if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("Please add a bot token");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log("registering bot's listeners");
bot.start((ctx) => ctx.reply("Welcome"));
bot.hears("hello", (ctx) => {
  console.log("got hello");
  ctx.reply("Hello to you too!");
});
bot.hears("date", (ctx) => {
  console.log("got date");
  ctx.reply("Date and time is: " + new Date());
});

bot.launch();
console.log("bot has been launched (no express) " + new Date());
function startExpress() {
  const app = express();
  const port = process.env.PORT || 3333;

  app.use(bodyParser.json());
  app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
  app.use(bodyParser.text({ type: "text/html" }));

  app.get("/", async (req, res) => {
    res.json({ Hello: "World" });
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

// startExpress()
