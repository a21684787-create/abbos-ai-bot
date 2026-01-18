const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render o'chirib qo'ymasligi uchun port
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Assalomu alaykum! Abbosbekning boti tayyor. Savolingizni bering."));

bot.on('text', async (ctx) => {
  try {
    const chat = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama-3.3-70b-versatile",
    });
    ctx.reply(chat.choices[0].message.content);
  } catch (e) {
    ctx.reply("Xatolik yuz berdi.");
  }
});

bot.launch().then(() => console.log("Bot yoqildi!"));
