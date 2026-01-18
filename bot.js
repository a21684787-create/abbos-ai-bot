const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render o'chib qolmasligi uchun server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 10000);

// API kalitlarini tozalab olish (trim orqali bo'sh joylarni o'chiramiz)
const BOT_TOKEN = process.env.BOT_TOKEN ? process.env.BOT_TOKEN.trim() : "";
const GROQ_KEY = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";

const bot = new Telegraf(BOT_TOKEN);
const openai = new OpenAI({
  apiKey: GROQ_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Assalomu alaykum! Bot muvaffaqiyatli ishga tushdi. Savol bering!"));

bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama3-8b-8192",
    });
    await ctx.reply(response.choices[0].message.content);
  } catch (err) {
    console.error("AI Error:", err.message);
    // Agar kalit xato bo'lsa, aniq sababini aytadi
    await ctx.reply("Xatolik: " + err.message);
  }
});

// Botni ishga tushirish
bot.launch().then(() => console.log(">>> BOT TAYYOR!"));
