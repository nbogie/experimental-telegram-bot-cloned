import express from "express";

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
