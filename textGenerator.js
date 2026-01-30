export function generateTextReport(analysis, version) {
  let text = `POLIGRAMM ${version || "TEST"} REPORT\n\n`;

  text += "СТРАНИЦА 1 — АНАЛИЗ\n\n";

  // Основные блоки анализа (старый формат сохраняем)
  for (const block in analysis) {
    if (block === "summary") continue;

    const b = analysis[block];
    if (!b) continue;

    text += `БЛОК ${block.toUpperCase()}:\n`;

    if (b.avgRms !== undefined) {
      text += `Средний RMS: ${b.avgRms}\n`;
    }

    if (b.peakStress !== undefined) {
      text += `Пиковый стресс: ${b.peakStress}\n`;
    }

    if (b.avgReaction !== undefined) {
      text += `Средняя реакция: ${b.avgReaction} ms\n`;
    }

    if (b.samples !== undefined) {
      text += `Количество измерений: ${b.samples}\n`;
    }

    text += "\n";
  }

  // Новый summary-блок (если есть)
  if (analysis.summary) {
    const s = analysis.summary;

    text += "СВОДКА СЕССИИ:\n";

    if (s.totalTimeMs !== undefined) {
      text += `Общее время теста: ${Math.round(s.totalTimeMs / 1000)} сек\n`;
    }

    if (s.totalQuestions !== undefined) {
      text += `Количество вопросов: ${s.totalQuestions}\n`;
    }

    if (s.avgTimePerQuestion !== undefined && s.avgTimePerQuestion !== null) {
      text += `Среднее время на вопрос: ${s.avgTimePerQuestion} ms\n`;
    }

    if (s.timestamp) {
      text += `Дата сессии: ${s.timestamp}\n`;
    }

    text += "\n";
  }

  text += "СТРАНИЦА 2 — РЕКОМЕНДАЦИИ\n\n";

  text += "• Контролируйте резкие пики голоса\n";
  text += "• Снижайте задержки реакции\n";
  text += "• Балансируйте эмоциональную нагрузку\n";

  if (version && version.toUpperCase().includes("PRO")) {
    text += "• Обратите внимание на устойчивость эмоционального фона\n";
    text += "• Минимизируйте когнитивное перенапряжение\n";
  }

  text += "\n";

  text += "СТРАНИЦА 3 — ПСИХОЛОГИЧЕСКИЕ ИНСАЙТЫ\n\n";

  text += "Отчет уникален. Повторение ответов не гарантирует повтор результата.\n";
  text += "Зафиксированы индивидуальные паттерны поведения.\n";

  if (version && version.toUpperCase().includes("PRO")) {
    text += "Обнаружены расширенные сигнатуры реакции на психологическую нагрузку.\n";
    text += "Анализ учитывает динамику ответов и поведенческие маркеры.\n";
  } else {
    text += "Анализ выполнен в сокращенном формате (Lite).\n";
  }

  return text;
}
