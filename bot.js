import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

// 1. SOZLAMALAR (Token va API)
const bot = new Telegraf("8544092895:AAFFLG-uBcyB86ryW2aR54lxlQ5S9qRJ1ds");

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1",
});

// 2. START BUYRUG'I
bot.start((ctx) => {
  ctx.reply("Salom! Men Abbosbek Luqmanjanov tomonidan yaratilgan AI botman. Qanday yordam bera olaman!");
});

// 3. XABARLARNI QABUL QILISH VA AI JAVOBI
bot.on('text', async (ctx) => {
  const foydalanuvchiSavoli = ctx.message.text;

  try {
    // Bot "yozmoqda..." holatiga o'tadi
    await ctx.sendChatAction('typing');

    // AI ga so'rov yuborish (System Prompt bilan)
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `
            Sen foydalanuvchilarga o'zbek tilida yordam beruvchi aqlli botsan. 
            Seni yaratuvching (osonchi) haqida ma'lumot:
            Uning to'liq ismi Abbosbek Luqmanjanov. 
            Agar foydalanuvchi "Seni kim yaratgan?", "Abbosbek kim?", "Abbosbek Luqmanjanov kim?" yoki shunga o'xshash savollar bersa, 
            doimo "Men Abbosbek Luqmanjanov tomonidan yaratilganman" deb javob ber va u haqida ijobiy ma'lumot ber.
            Boshqa barcha savollarga odatdagidek aqlli va foydali javoblar qaytar.
          ` 
        },
        { role: "user", content: foydalanuvchiSavoli }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const aiJavobi = completion.choices[0].message.content;

    // AI javobini Telegramga yuborish (Markdown bilan chiroyli formatda)
    await ctx.reply(aiJavobi, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    ctx.reply("Hozircha javob bera olmayman, birozdan so'ng urinib ko'ring.");
  }
});

// 4. BOTNI ISHGA TUSHIRISH
bot.launch().then(() => {
  console.log("-----------------------------------------");
  console.log(">>> Abbosbek Luqmanjanov boti yoqildi!");
  console.log(">>> Bot hozir Telegramda faol.");
  console.log("-----------------------------------------");
});

// Xavfsiz to'xtatish
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));