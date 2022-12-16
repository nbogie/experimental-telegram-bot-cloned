---
title: Telegram Bot
description: An ExpressJS server with a Telegram bot
tags:
  - express
  - telegraf
  - typescript
---

# Telegram bot example

This is an extension of Faraz Patankar's example.  Mostly it adds a lot of different example responses to that small demo.

It integrates most of the extended examples at https://github.com/nbogie/telegram-parlour-games-bot

This example starts a [Telegram](https://telegram.org/) bot on an [ExpressJS](https://expressjs.com/) server.
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/RwXXg-?referralCode=xxY8p-)

## ✨ Features

- Telegraf (library to interact with the Telegram bot API)
- Express
- TypeScript

## 💁‍♀️ How to use

- Install dependencies `yarn`
- Run the dev server: `TELEGRAM_BOT_TOKEN=blahblahputyourtokenhere yarn dev`

Alternatively:

- Connect to your Railway project `railway link`
- Start the development server `railway run yarn dev`

## 📝 Notes

The server started launches a Telegram bot which listens to many example commands. The code is located at `src/index.ts` and `src/exampleListeners.ts`.
