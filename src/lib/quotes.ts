const quotes = [
  { darija: "اللي بغا الشهد يصبر لقريص النحل 🐝", fr: "Qui veut le miel doit supporter les piqûres 🐝" },
  { darija: "القراية هي المفتاح ديال النجاح 🔑", fr: "L'étude est la clé du succès 🔑" },
  { darija: "كل يوم فيه فرصة جديدة باش تتعلم شي حاجة 📚", fr: "Chaque jour est une nouvelle chance d'apprendre 📚" },
  { darija: "ما تستسلمش، الطريق طويل ولكن النتيجة كتستاهل 💪", fr: "N'abandonne pas, le chemin est long mais ça vaut le coup 💪" },
  { darija: "اللي كيقرا اليوم، غادي يتفوق غدا ⭐", fr: "Celui qui étudie aujourd'hui excellera demain ⭐" },
  { darija: "قليل دائم خير من كثير منقطع 📖", fr: "Un peu chaque jour vaut mieux que beaucoup rarement 📖" },
  { darija: "النجاح ماشي صدفة، النجاح هو مجهود يومي 🎯", fr: "Le succès n'est pas un hasard, c'est un effort quotidien 🎯" },
  { darija: "تيق فراسك، نتا قادر تدير شي حاجة عظيمة 🌟", fr: "Crois en toi, tu peux faire de grandes choses 🌟" },
];

export function getRandomQuote(lang: "darija" | "fr") {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index][lang];
}

export function getDailyQuote(lang: "darija" | "fr") {
  const today = new Date();
  const index = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % quotes.length;
  return quotes[index][lang];
}
