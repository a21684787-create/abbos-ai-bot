const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const http = require('http');

// Render o'chib qolmasligi uchun
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is Active');
}).listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

bot.start((ctx) => ctx.reply("Assalomu alaykum! Abbosbekning boti tayyor. Savol bering!"));

bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: ctx.message.text }],
      model: "llama3-8b-8192", // Bu model juda tez va bepul limitda yaxshi ishlaydi
    });

    const aiResponse = response.choices[0].message.content;
    await ctx.reply(aiResponse);

  } catch (error) {
    console.error("Xatolik:", error.message);
    await ctx.reply("Xatolik yuz berdi. Birozdan so'ng urinib ko'ring.");
  }
});

async function main() {
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  bot.launch().then(() => console.log("Bot ishga tushdi!"));
}

main();
