export function analyzeMetrics(metrics) {
  const blocks = {};

  // ✅ Поддержка старого формата (Array)
  if (Array.isArray(metrics)) {
    metrics.forEach(m => {
      if (!m.block) return;
      if (!blocks[m.block]) blocks[m.block] = [];
      blocks[m.block].push(m);
    });
  }

  // ✅ Поддержка нового формата (Object от Lite / Pro)
  if (!Array.isArray(metrics) && typeof metrics === "object") {
    // Если пришли questionTimes (Lite / Pro timing mode)
    if (Array.isArray(metrics.questionTimes)) {
      blocks["timing"] = metrics.questionTimes.map((time, index) => ({
        block: "timing",
        voiceRmsAvg: 0,
        voiceRmsPeak: 0,
        responseTimeMs: time,
        questionIndex: index
      }));
    }

    // Если пришли сырые массивы метрик (на будущее)
    if (Array.isArray(metrics.rawMetrics)) {
      metrics.rawMetrics.forEach(m => {
        if (!m.block) return;
        if (!blocks[m.block]) blocks[m.block] = [];
        blocks[m.block].push(m);
      });
    }
  }

  const result = {};

  for (const block in blocks) {
    const data = blocks[block];

    if (!data.length) continue;

    const avgRms =
      data.reduce((s, m) => s + (m.voiceRmsAvg || 0), 0) / data.length;

    const peakStress = Math.max(
      ...data.map(m => m.voiceRmsPeak || 0)
    );

    const avgReaction =
      data.reduce((s, m) => s + (m.responseTimeMs || 0), 0) / data.length;

    result[block] = {
      avgRms: Number(avgRms).toFixed(2),
      peakStress: Number(peakStress).toFixed(2),
      avgReaction: Math.round(avgReaction),
      samples: data.length
    };
  }

  // ✅ Добавляем сводные метрики Lite / Pro (если есть)
  if (!Array.isArray(metrics) && typeof metrics === "object") {
    if (metrics.totalTime) {
      result.summary = {
        totalTimeMs: metrics.totalTime,
        totalQuestions: metrics.totalQuestions || null,
        avgTimePerQuestion: metrics.totalQuestions
          ? Math.round(metrics.totalTime / metrics.totalQuestions)
          : null,
        timestamp: metrics.timestamp || new Date().toISOString()
      };
    }
  }

  return result;
}
