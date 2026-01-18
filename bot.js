const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render port xatosi bermasligi uchun kichik server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot ishlamoqda...');
}).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Abbosbekning boti tayyor. Savolingizni bering."));

bot.on('text', async (ctx) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Sen Abbosbek Luqmanjanov yaratgan aqlli yordamchisan." },
        { role: "user", content: ctx.message.text }
      ],
      model: "llama-3.3-70b-versatile",
    });
    ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.error(e);
    ctx.reply("Hozircha javob bera olmayman, birozdan so'ng yozib ko'ring.");
  }
});

bot.launch().then(() => console.log(">>> Bot muvaffaqiyatli yoqildi!"));
