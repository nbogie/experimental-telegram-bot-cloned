import express from "express";

/** configures and starts express on process.env.PORT.
 *
 * You might find this useful for another way to interact
 * with the server other than the bot.
 * (e.g. to change a message-of-the-day, or to obtain stats)
 */
function configureAndStartExpress() {
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
export { configureAndStartExpress };
