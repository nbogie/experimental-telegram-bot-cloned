import fs from "fs";
import axios from "axios";
import { Context, Telegraf } from "telegraf";

/** Register a listener on the bot to process received photos, saving them to disk. */
function setupPhotoSaver(bot: Telegraf<Context>) {
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
    const response = await axios.get(url.toString(), {
      responseType: "stream",
    });
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
}

export { setupPhotoSaver };
