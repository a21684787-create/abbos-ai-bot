const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render o'chirib qo'ymasligi uchun Web Server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Active');
});
server.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Abbosbekning boti tayyor. Savolingizni bering!"));

bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama-3.3-70b-versatile",
    });
    await ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.error("AI Error:", e.message);
  }
});

async function launch() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    console.log(">>> Bot muvaffaqiyatli yoqildi!");
  } catch (err) {
    console.error("Launch Error:", err);
  }
}

launch();

process.on('uncaughtException', (err) => console.error('System Error:', err));
process.on('unhandledRejection', (err) => console.error('Promise Error:', err));
