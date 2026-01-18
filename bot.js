const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render o'chirib qo'ymasligi uchun majburiy Web Server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot ishlamoqda...');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Abbosbekning boti tayyor. Marhamat, savolingizni bering!"));

bot.on('text', async (ctx) => {
  try {
    // Foydalanuvchiga bot o'ylayotganini ko'rsatish
    await ctx.sendChatAction('typing');
    
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama-3.3-70b-versatile",
    });
    
    await ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.error("Xatolik yuz berdi:", e.message);
    // Agar Groq xatosi bo'lsa, foydalanuvchiga bildirish
    if (e.message.includes("401")) ctx.reply("API kalitda xatolik bor.");
    else ctx.reply("Hozir bot biroz band, 10 soniyadan keyin qayta yozib ko'ring.");
  }
});

// Botni ishga tushirish (xatolarni ushlash bilan)
bot.launch({
  polling: {
    dropPendingUpdates: true // Bot o'chiq bo'lganda yuborilgan eski xabarlarni o'chirib yuboradi
  }
}).then(() => console.log(">>> Bot muvaffaqiyatli yoqildi!"));

// Server to'xtab qolmasligi uchun xatolarni ushlash
process.on('uncaughtException', (err) => console.error('Tizim xatosi:', err));
process.on('unhandledRejection', (err) => console.error('Rad etilgan va'da:', err));
