function analyze(metrics) {
  const blocks = {};

  metrics.forEach(m => {
    if (!blocks[m.block]) blocks[m.block] = [];
    blocks[m.block].push(m);
  });

  let text = "📊 Страница 1: Анализ блоков\n\n";

  for (const block in blocks) {
    const items = blocks[block];
    const avgRms =
      items.reduce((s, i) => s + i.voiceRmsAvg, 0) / items.length;

    const avgTime =
      items.reduce((s, i) => s + i.responseTimeMs, 0) / items.length;

    text += `Блок ${block.toUpperCase()}:\n`;
    text += `Средний RMS: ${avgRms.toFixed(2)}\n`;
    text += `Среднее время реакции: ${avgTime.toFixed(0)} ms\n\n`;
  }

  text +=
    "📝 Страница 2: Рекомендации\n\n" +
    "Контроль эмоций, внимание к стрессовым пикам, работа с реакциями.\n\n" +
    "✨ Страница 3: Психологические инсайты\n\n" +
    "Отчет сформирован индивидуально. Даже при схожих ответах результат уникален.";

  return text;
}

module.exports = { analyze };
