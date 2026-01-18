const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render uchun server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Salom! Men tayyorman. Savolingizni yozing."));

bot.on('text', async (ctx) => {
  try {
    // Bot ishlayotganini ko'rsatish
    await ctx.sendChatAction('typing');

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama-3.3-70b-versatile",
    });

    const reply = response.choices[0].message.content;
    await ctx.reply(reply);
    
  } catch (e) {
    console.error("Xatolik tafsiloti:", e);
    
    // Foydalanuvchiga tushunarli xato xabari
    if (e.message.includes("401")) {
      ctx.reply("Xato: Groq API kaliti noto'g'ri kiritilgan.");
    } else if (e.message.includes("429")) {
      ctx.reply("Xato: API limit tugadi. Birozdan keyin urinib ko'ring.");
    } else {
      ctx.reply("Xato yuz berdi: " + e.message);
    }
  }
});

async function startBot() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.launch();
    console.log(">>> BOT_READY");
  } catch (err) {
    console.error("Launch Error:", err);
  }
}

startBot();
