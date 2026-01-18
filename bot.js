const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render porti uchun server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running...');
});

server.listen(process.env.PORT || 3000);

// O'z-o'zini uyg'otish (Self-ping) funksiyasi
// Bu botni har 10 daqiqada "turtib" turadi
setInterval(() => {
  http.get(`http://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
  console.log("O'z-o'zini uyg'otish bajarildi.");
}, 10 * 60 * 1000); // har 10 daqiqada

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Abbosbekning boti 24/7 xizmatingizda."));

bot.on('text', async (ctx) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Sen Abbosbek Luqmanjanov yaratgan foydali yordamchisan." },
        { role: "user", content: ctx.message.text }
      ],
      model: "llama-3.3-70b-versatile",
    });
    ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.error(e);
    ctx.reply("Birozdan so'ng yozib ko'ring.");
  }
});

bot.launch().then(() => console.log(">>> Bot yoqildi!"));
