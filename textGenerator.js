export function generateTextReport({ baseline, blocks }) {
  let text = "POLIGRAM REPORT\n\n";

  text += "BASELINE\n";
  text += `Avg reaction: ${baseline.responseTime.toFixed(0)} ms\n`;
  text += `Avg RMS: ${baseline.rms.toFixed(2)}\n\n`;

  for (const block in blocks) {
    const arr = blocks[block];
    const avgStress =
      arr.reduce((s, m) => s + m.stressDelta, 0) / arr.length;

    text += `BLOCK: ${block.toUpperCase()}\n`;
    text += `Questions: ${arr.length}\n`;
    text += `Stress deviation: ${avgStress.toFixed(2)}\n\n`;
  }

  text += "INSIGHT\n";
  text += "Report is individually generated and non-repeatable.\n";

  return text;
}
