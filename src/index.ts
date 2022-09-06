import bodyParser from "body-parser";
import express from "express";
import { Telegraf } from "telegraf";
import axios from "axios";
import fs from "fs";
/*
  TELEGRAM_BOT_TOKEN is an environment variable
  that should be configured on Railway  
*/

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("Please add a bot token");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log("Registering bot's listeners");
bot.start((ctx) => ctx.reply("Welcome"));

bot.hears("hello", (ctx) => {
  console.log("got hello");
  ctx.reply("Hello to you too!");
});

bot.hears("date", (ctx) => {
  console.log("got date");
  ctx.reply("Date and time is: " + new Date());
});

//  "/dicetest"
bot.command("dicetest", (ctx) => ctx.replyWithDice());

//  "/maptest"
bot.command("maptest", (ctx) => ctx.replyWithLocation(51.5138453, -0.1005393));

//  "/whonext"
bot.command("whonext", (ctx) => {
  const name = pick(["Alice", "Bob", "Charlie", "Dave", "Erin"]);
  ctx.reply(name + " is up next!");
});

// "/photo"
bot.command("photo", (ctx) => {
  const randomPhotoURL = "https://picsum.photos/200/300/?random";
  ctx.replyWithPhoto({ url: randomPhotoURL });
  //NOTE: don't call replyWithPhoto destructured with no receiver - it needs a reference to ctx as `this`
  // instead call ctx.replyWithPhoto
});

// "/dog spaniel"
bot.command("dog", async (ctx) => {
  //1. get the breed from the command text
  const parts = ctx.message.text.split(" ");
  if (parts.length <= 1) {
    return ctx.reply("Missing breed.  Try /dog spaniel");
  }
  const breed = parts[1];

  //2. fetch a random image URL for this breed, from the dog API
  const url = `https://dog.ceo/api/breed/${breed}/images/random`;

  try {
    const response = await axios.get(url);

    //just an example response, unused
    const exampleResponse = {
      message: "https://images.dog.ceo/breeds/hound-blood/n02088466_10335.jpg",
      status: "success",
    };

    const photoURL = response.data.message;

    //3. reply with photo
    ctx.replyWithPhoto(photoURL);
  } catch (error) {
    //TODO: this too-wide try-catch is hiding too
    //many possible errors unrelated to the fetch.
    //Write a function that does the fetch and ALWAYS returns a value (Either Error RandomPhotoData)
    ctx.reply("Error - maybe try a different breed?");
  }
});
// "/fortune"
bot.command("fortune", (ctx) => {
  axios
    .get("http://yerkee.com/api/fortune")
    .then(function (response) {
      ctx.reply(response.data.fortune);
    })
    .catch(function (error) {
      ctx.reply("Your future is not clear to me (error)");
      console.error("When fetching or processing fortune: ", error);
    });
});

// "/gamepoll"
bot.command("/gamepoll", (ctx) => {
  ctx.replyWithPoll(
    "What game shall we play?",
    [
      "Insider",
      "Just One",
      "Scategories",
      "Sixes",
      "Story Cubes",
      "Fake Artist",
      "SpyFall",
    ],
    { is_anonymous: false }
  );
});

bot.command("/colourpoll", async (ctx) => {
  const pollMessage = await ctx.replyWithPoll(
    "What is your favourite colour? Quick!",
    ["blue", "no, yellow", "pink", "purple", "green"],
    { is_anonymous: false }
  );
  console.log(pollMessage);

  setTimeout(() => {
    ctx.stopPoll(pollMessage.message_id);
    ctx.reply("(Poll is now closed!)");
  }, 40000);
});

// "/aboutme"
bot.command("/aboutme", async (ctx) => {
  const sender = await ctx.telegram.getChatMember(
    ctx.message.chat.id,
    ctx.message.from.id
  );
  console.log("from: ", ctx.message.from);

  console.log(sender, sender.status);
  ctx.replyWithMarkdown(
    "```\n" + `${JSON.stringify(sender, null, 2)}` + "\n```"
  );
});

// "/timer 10"
bot.command("timer", (ctx) => {
  //TODO: Telegram supports scheduled messages - may be preferred?
  // However, resolution unlikely to be accurate - a message scheduled within
  //10 seconds is sent immediately.

  const parts = ctx.message.text.split(" ");
  const usageExample = "Try '/timer 30' for a 30-second timer.";
  console.log("parts", parts);
  if (parts.length < 2) {
    return ctx.reply(usageExample);
  }
  const timeSec = parseInt(parts[1]);
  if (timeSec < 1 || timeSec > 300) {
    return ctx.reply("This is only for short timers (1-300 seconds)");
  }

  setTimeout(
    () => ctx.replyWithMarkdown(":stopwatch _Brrrrrrinnng!  Time's up!_"),
    timeSec * 1000
  );
});

bot.on("sticker", (ctx) => ctx.reply("👍"));

//when a photo is sent to the bot!
//WARNING: this will attempt to write files to bot's local disk space
bot.on("photo", async (ctx) => {
  const files = ctx.message.photo;
  const fileId = files[0].file_id;
  console.log(
    `I was sent a photo.  (Caption: ${ctx.message.caption}).  Files (various sizes): `,
    files
  );
  //WARNING! This URL from file link will have your bot token in it - don't publish it!
  const url = await ctx.telegram.getFileLink(fileId);

  const saveResult = await savePhotoToDisk(url, files[0].file_unique_id);
  console.log("Result of save: ", saveResult);
  ctx.reply("I saved that photo locally, thanks!");
});

async function savePhotoToDisk(url: URL, image_id: string) {
  const response = await axios.get(url.toString(), { responseType: "stream" });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(`./saved_images/${image_id}.jpg`))
      .on("finish", () => {
        console.log("Saved file locally");
        resolve("ok");
      })
      .on("error", (e: unknown) => {
        console.error("While saving image to disk: ", e);
        reject(e);
      });
  });
}

bot.launch();

// // Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function startExpress() {
  const app = express();
  const port = process.env.PORT ?? 3333;

  app.use(express.json());
  app.use(express.raw({ type: "application/vnd.custom-type" }));
  app.use(express.text({ type: "text/html" }));

  app.get("/", async (req, res) => {
    res.json({ Hello: "World" });
  });

  app.listen(port, () => {
    console.log(`Telegram bot's express app listening on port: ${port}`);
  });
}

startExpress();
