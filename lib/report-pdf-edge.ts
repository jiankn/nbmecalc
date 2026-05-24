import type { ReportData } from "@/lib/session-report";
import type { PracticeExam, PredictionResult } from "@/lib/data";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 46;
const TEXT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const STEP_LABEL: Record<PredictionResult["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

const PASS_THRESHOLD: Record<PredictionResult["step"], number> = {
  step1: 196,
  step2: 214,
  step3: 198,
};

type FontName = "regular" | "bold";

interface PdfPage {
  commands: string[];
}

interface TextOptions {
  font?: FontName;
  size?: number;
  gapAfter?: number;
  indent?: number;
}

class PdfWriter {
  private pages: PdfPage[] = [{ commands: [] }];
  private y = PAGE_HEIGHT - MARGIN;

  heading(text: string, size = 18) {
    this.ensure(size + 16);
    this.text(text, { font: "bold", size, gapAfter: 8 });
  }

  subheading(text: string) {
    this.ensure(30);
    this.text(text, { font: "bold", size: 13, gapAfter: 5 });
  }

  paragraph(text: string, options: TextOptions = {}) {
    const size = options.size ?? 9.5;
    const lineHeight = size * 1.35;
    const indent = options.indent ?? 0;
    const lines = wrapText(cleanText(text), TEXT_WIDTH - indent, size);
    this.ensure(lines.length * lineHeight + (options.gapAfter ?? 6));
    for (const line of lines) {
      this.drawText(line, MARGIN + indent, this.y, size, options.font ?? "regular");
      this.y -= lineHeight;
    }
    this.y -= options.gapAfter ?? 6;
  }

  bullet(text: string) {
    this.paragraph(`- ${text}`, { indent: 10, gapAfter: 3 });
  }

  keyValue(label: string, value: string) {
    this.ensure(14);
    this.drawText(`${cleanText(label)}:`, MARGIN, this.y, 9.5, "bold");
    this.drawText(cleanText(value), MARGIN + 126, this.y, 9.5, "regular");
    this.y -= 14;
  }

  divider() {
    this.ensure(14);
    this.current.commands.push(
      `0.86 0.89 0.93 RG 0.8 w ${MARGIN} ${this.y} m ${PAGE_WIDTH - MARGIN} ${this.y} l S`
    );
    this.y -= 14;
  }

  toUint8Array(): Uint8Array {
    const objects: string[] = [];
    const add = (body: string) => {
      objects.push(body);
      return objects.length;
    };

    add("<< /Type /Catalog /Pages 2 0 R >>");
    add("");
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

    const pageIds: number[] = [];
    for (const page of this.pages) {
      const stream = page.commands.join("\n");
      const contentId = objects.length + 2;
      const pageId = add(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`
      );
      add(`<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`);
      pageIds.push(pageId);
    }

    objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(byteLength(pdf));
      pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefOffset = byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let i = 1; i < offsets.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  private get current() {
    return this.pages[this.pages.length - 1];
  }

  private ensure(height: number) {
    if (this.y - height < MARGIN) {
      this.pages.push({ commands: [] });
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  private text(text: string, options: TextOptions = {}) {
    this.paragraph(text, options);
  }

  private drawText(text: string, x: number, y: number, size: number, font: FontName) {
    const fontRef = font === "bold" ? "F2" : "F1";
    this.current.commands.push(
      `BT /${fontRef} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfString(text)}) Tj ET`
    );
  }
}

export function createReportPdf(data: ReportData): Uint8Array {
  const writer = new PdfWriter();
  const result = data.result;
  const stepLabel = STEP_LABEL[result.step];
  const threshold = PASS_THRESHOLD[result.step];
  const issued = formatDate(data.purchasedAt);

  writer.heading("NBMEcalc Premium Score Report", 21);
  writer.paragraph(`Issued ${issued} | Session ${data.sessionId.slice(0, 24)}...`, {
    size: 8.5,
    gapAfter: 10,
  });
  writer.divider();

  writer.subheading("Headline Prediction");
  writer.keyValue(`Predicted ${stepLabel}`, String(result.pointEstimate));
  writer.keyValue("95% confidence interval", `${result.ciLower}-${result.ciUpper}`);
  writer.keyValue("Pass probability", formatPct(result.passProbability));
  writer.keyValue("Margin vs pass threshold", `${result.pointEstimate - threshold} pts (threshold ${threshold})`);
  writer.keyValue("Inputs used", `${result.inputCount} exam${result.inputCount === 1 ? "" : "s"}`);
  writer.keyValue("Cohort basis", `${result.cohortSize.toLocaleString("en-US")} historical takers`);
  writer.paragraph(result.cohortNote, { size: 8.5 });

  writer.subheading("Practice Exams Submitted");
  for (const exam of data.exams) {
    writer.bullet(formatExam(exam));
  }

  writer.subheading("Risk Profile");
  writer.paragraph(result.riskProfile.headline, { font: "bold" });
  writer.keyValue("Floor / ceiling", `${result.riskProfile.floor}-${result.riskProfile.ceiling}`);
  writer.keyValue("Spread", `${result.riskProfile.spread} pts (${result.riskProfile.spreadVsTypical})`);
  writer.paragraph(result.riskProfile.rootCause);

  writer.subheading("One Decision");
  writer.paragraph(result.oneDecision.headline, { font: "bold" });
  writer.keyValue("Recommendation", result.oneDecision.recommendation.replaceAll("_", " "));
  writer.keyValue("Confidence", result.oneDecision.confidence);
  writer.paragraph("Why:", { font: "bold", gapAfter: 2 });
  for (const reason of result.oneDecision.reasons) writer.bullet(reason);
  writer.paragraph("Reverse triggers:", { font: "bold", gapAfter: 2 });
  for (const trigger of result.oneDecision.reverseTriggers) writer.bullet(trigger);

  writer.subheading("High-Leverage Moves");
  for (const move of result.highLeverageMoves.items) {
    writer.paragraph(`${move.rank}. ${move.title} (${move.expectedImpact})`, {
      font: "bold",
      gapAfter: 2,
    });
    writer.paragraph(`Why: ${move.why}`, { indent: 10, gapAfter: 2 });
    writer.paragraph(`When: ${move.when}`, { indent: 10, gapAfter: 5 });
  }

  writer.subheading("Anti-Patterns To Avoid");
  for (const item of result.antiPatterns.items) {
    writer.paragraph(item.title, { font: "bold", gapAfter: 2 });
    writer.paragraph(item.reason, { indent: 10, gapAfter: 2 });
    writer.paragraph(`Based on: ${item.basedOn}`, { indent: 10, size: 8.5, gapAfter: 5 });
  }

  writer.subheading("Test-Day Protocol");
  if (result.testDayProtocol.show) {
    writer.paragraph("Day -1:", { font: "bold", gapAfter: 2 });
    for (const item of result.testDayProtocol.dayMinusOne) writer.bullet(item);
    writer.paragraph("Day 0:", { font: "bold", gapAfter: 2 });
    for (const item of result.testDayProtocol.dayZero) writer.bullet(item);
    writer.paragraph("Do not:", { font: "bold", gapAfter: 2 });
    for (const item of result.testDayProtocol.doNots) writer.bullet(item);
  } else {
    writer.paragraph("This section activates when your exam is within 7 days.");
  }

  writer.subheading("Cohort Mirror");
  writer.paragraph(result.cohortMirror.cohortDescription);
  writer.keyValue("Projected median", String(result.cohortMirror.median));
  writer.keyValue("Your percentile", `${result.cohortMirror.yourPercentile}th`);
  for (const bucket of result.cohortMirror.buckets) {
    writer.bullet(`${bucket.range}: ${formatPct(bucket.percentage)}${bucket.isYourProjection ? " (your projected band)" : ""}`);
  }
  writer.paragraph(result.cohortMirror.disclaimer, { size: 8.5 });

  writer.subheading("Honest Uncertainty");
  writer.paragraph("What this model cannot predict:", { font: "bold", gapAfter: 2 });
  for (const item of result.honestUncertainty.cannotPredict) writer.bullet(item);
  writer.paragraph("When we would be wrong:", { font: "bold", gapAfter: 2 });
  for (const item of result.honestUncertainty.whenWedBeWrong) writer.bullet(item);
  writer.paragraph(result.honestUncertainty.notAffiliatedNote, { size: 8.5 });

  writer.subheading("Disclaimer");
  writer.paragraph(
    "NBMEcalc is an independent educational planning tool. It is not affiliated with NBME, USMLE, FSMB, ECFMG, UWorld, AMBOSS, or any exam sponsor. This report is not medical, legal, academic, or licensure advice. Use it as one input in your study planning decisions."
  );

  return writer.toUint8Array();
}

function formatExam(exam: PracticeExam): string {
  const form = exam.formNumber ? ` ${exam.formNumber}` : "";
  const days = typeof exam.takenDaysAgo === "number" ? `, ${exam.takenDaysAgo}d ago` : "";
  return `${exam.source}${form}: ${exam.score}${days}`;
}

function formatPct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const maxChars = Math.max(18, Math.floor(maxWidth / (fontSize * 0.52)));
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (line) {
        lines.push(line);
        line = "";
      }
      for (let i = 0; i < word.length; i += maxChars) {
        lines.push(word.slice(i, i + maxChars));
      }
      continue;
    }

    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function cleanText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≈/g, "~")
    .replace(/±/g, "+/-")
    .replace(/×/g, "x")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/∞/g, "infinity")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfString(value: string): string {
  return cleanText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
