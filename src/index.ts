import { Telegraf } from "telegraf";
import { configureAndStartExpress } from "./setupExpress";
import { registerManyExampleListeners } from "./exampleListeners";
import { setupPhotoSaver } from "./photoSaver";
import { config } from "dotenv";
config();

/*
  TELEGRAM_BOT_TOKEN is an environment variable
  that should be obtained from botfather and
  configured on the hosting environment.
*/

if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("Please add a bot token");
}
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

registerManyExampleListeners(bot);
//setupPhotoSaver(bot);

bot.launch();

// // Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//optional
configureAndStartExpress();
