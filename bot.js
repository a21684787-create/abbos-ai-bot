const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render uyquga ketmasligi uchun server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Bot ishga tushdi."));

bot.on('text', async (ctx) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama-3.3-70b-versatile",
    });
    ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.log("Xatolik:", e.message);
  }
});

async function startBot() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    console.log("BOT_READY");
  } catch (err) {
    console.error(err);
  }
}

startBot();
