const HARD_CONSTRAINTS = `Purely visual editorial photograph. All visible surfaces are plain and unmarked. Papers and screens, when present, contain only a few large solid-color geometric blocks, never line-sized details. Exclude written language, digits, punctuation, interface copy, logos, product marks, and watermarks.`;

const PHOTO_STYLE = `Photorealistic editorial photography for a premium medical-education publication. Clean modern visual language, restrained mint green, warm cream, charcoal, and muted blue palette; natural materials; believable medical-student environment; subtle fine film grain; realistic skin and hands; no glossy stock-photo posing, no illustration, no CGI.`;

function summaryPrompt(scene) {
  return `${HARD_CONSTRAINTS}\n\nUse case: photorealistic-natural. Asset type: blog summary card and social preview. ${scene}\n\nComposition: bold, instantly readable visual metaphor with one clear focal point, uncluttered 2:1 landscape framing, subject centered with safe crop margins, crisp at thumbnail size. Lighting: soft directional daylight with controlled shadows. ${PHOTO_STYLE}`;
}

function detailPrompt(scene) {
  return `${HARD_CONSTRAINTS}\n\nUse case: photorealistic-natural. Asset type: article detail hero. ${scene}\n\nComposition: cinematic 3:2 landscape editorial frame with layered foreground and background, generous breathing room, emotionally natural rather than posed. Lighting: soft window light with subtle depth and realistic contrast. ${PHOTO_STYLE}`;
}

const articles = [
  {
    slug: "how-to-read-nbme-score-report",
    summary: `Top-down still life of a blank medical assessment report with several unlabeled horizontal performance bands, a magnifying glass isolating one important band, and a plain pencil on a light oak desk. The scene communicates extracting signal from a dense score report without panic.`,
    detail: `A medical student at a quiet desk calmly reviews a blank assessment report beside a laptop showing only abstract horizontal performance bars. Their posture shifts from tension to clarity as they mark two weak areas with plain color tabs; face shown naturally in three-quarter profile.`,
  },
  {
    slug: "nbme-30-vs-31-vs-32-which-is-hardest",
    summary: `Three identical blank exam booklets arranged as a left-to-right progression, each distinguished only by a muted color tab; a precision balance and a small target marker suggest comparison of difficulty versus predictive accuracy. No markings on the booklets.`,
    detail: `A focused medical student compares three closed plain practice-exam booklets distinguished only by color tabs. The final booklet sits closest to a small bullseye-shaped paperweight while the first is physically thicker and more intimidating, conveying hardest-feeling versus most-predictive without reports or printed pages.`,
  },
  {
    slug: "step-2-ck-14-day-cram-plan",
    summary: `A tightly organized two-week study desk: a completely blank grid planner, three clusters of color tabs, a practice booklet, pencil, timer with a blank face, and a single rest-day card set apart at the end. The visual communicates triage, checkpoints, and recovery.`,
    detail: `A medical student midway through an intensive short study sprint, working at a tidy desk. Fourteen plain wooden tokens form two neat rows: dense study clusters, three larger assessment checkpoints, lighter review tokens, and a final isolated rest token. No wall planner or printed materials.`,
  },
  {
    slug: "free-120-to-step-2-conversion-2026-guide",
    summary: `Top-down arrangement of a practice sheet containing only neat rows of empty circular bubbles, a plain calculator with a dark unlit display, and a smooth arrow-shaped cutout leading toward a simple colored gauge made from wooden pieces. The metaphor is converting percent correct into a defensible score estimate.`,
    detail: `A medical student compares three groups of blank answer bubbles using physical mint and charcoal counting tokens. A turned-away laptop adds study context without showing its screen. The scene feels analytical and reassuring, emphasizing calibration and timing close to test day.`,
  },
  {
    slug: "why-your-uwsa-score-is-misleading",
    summary: `A visual metaphor for score inflation built entirely from wooden blocks: one tall mint block viewed through a magnifying lens appears exaggerated, while two grounded clusters beside it remain smaller and realistic. Clean top-down editorial still life without charts or documents.`,
    detail: `A skeptical medical student compares one exaggerated tall acrylic bar against a tighter cluster of shorter physical blocks on the desk, using a ruler to correct the distortion. The laptop is closed and unbranded; there are no reports or printed charts.`,
  },
  {
    slug: "how-accurate-are-nbme-score-predictions",
    summary: `Several translucent acrylic signal ribbons converge physically toward a small bullseye paperweight, with the ribbons visibly tightening near the center. No reports, documents, screens, or charts. The image communicates correlation, aggregation, and honest remaining uncertainty.`,
    detail: `A medical student arranges separate translucent acrylic ribbons so they merge into one narrower forecast corridor around a central marker. The tactile desk experiment conveys rigorous multi-source prediction without any paper reports, graphs, or screens.`,
  },
  {
    slug: "truth-about-confidence-intervals-score-predictors",
    summary: `Minimal editorial still life of translucent mint and blue ribbons forming a wide-to-narrow probability corridor around a central marker, laid over a blank graph-paper sheet with no axes or labels. A compass divider suggests measured uncertainty.`,
    detail: `Close three-quarter view of a student studying an abstract forecast on a tablet: a central point surrounded by a clearly visible lower-to-upper translucent range. Multiple blank assessment cards nearby show why the band narrows with more evidence.`,
  },
  {
    slug: "step-2-ck-subject-weighting-explained",
    summary: `Color-coded stacks of blank study cards arranged by unequal size around a stethoscope: one large internal-medicine stack, several medium clinical stacks, and a few small specialty stacks. The unequal physical weights are the focal metaphor.`,
    detail: `A medical student sorts blank clinical review cards into visibly unequal piles on a large table, prioritizing the biggest pile beside a stethoscope while smaller piles sit by a reflex hammer, surgical instrument, and pediatric toy. Organized, practical decision-making.`,
  },
  {
    slug: "night-before-step-exam-what-to-do",
    summary: `Quiet evening flat lay of exam-day essentials already packed: a sealed plain cream envelope, clear water bottle, banana, nuts, folded sweater, glasses case, earplugs, and a simple clock face with tick marks only. A closed plain notebook signals that studying is finished; no laptop or branded device.`,
    detail: `A calm medical student in a softly lit bedroom finishes packing a small bag, then closes a blank notebook beside a dim lamp. Prepared essentials wait by the door while the bed and dark window create a restful pre-exam atmosphere.`,
  },
  {
    slug: "amboss-vs-uworld-which-qbank-wins",
    summary: `Balanced split composition with two unbranded tablets on a clean desk. One screen contains three large plain circles and one selected color tile; the other contains layered geometric reference cards, with no symbols or small interface details. A single pencil between them emphasizes choosing one path.`,
    detail: `A medical student evaluates two unbranded question-bank experiences side by side: one clean and streamlined, the other connected to a deep stack of reference cards. Their hand decisively pulls one tablet closer while leaving the second aside.`,
  },
  {
    slug: "average-step-2-score-whats-good",
    summary: `A blank sheet with a smooth unlabeled bell-curve ribbon and several specialty-related objects positioned at different points: stethoscope, reflex hammer, surgical instrument, and dermatology magnifier. A movable marker shows that a good score depends on the target.`,
    detail: `A senior medical student compares an abstract score-range band on a tablet with several possible residency paths represented by tasteful clinical objects and color-coded blank cards. The scene communicates context and personal target setting, not one universal benchmark.`,
  },
  {
    slug: "nbme-31-curve-easier-or-harder",
    summary: `Two blank practice-exam booklets balanced on a precision scale, with a smooth curved ribbon connecting them and a third booklet farther ahead as the final checkpoint. The scene contrasts perceived ease, scoring curve, and predictive accuracy.`,
    detail: `A medical student at the middle checkpoint of a three-stage assessment timeline. Three blank exam packets are spaced across the desk; the center packet is open and approachable, while a curved translucent band shows its adjusted relationship to the first.`,
  },
  {
    slug: "img-step-2-strategy-220-to-250",
    summary: `An international medical graduate's focused study still life: a closed plain navy travel booklet, stethoscope, face-down blank study cards, a row of mint progress markers, and a small hourglass. The upward arrangement suggests a long score-improvement path without flags, seals, or documents.`,
    detail: `An international medical graduate studies at a modest desk near a hospital window, practicing timed questions while face-down blank cards and three large color-block stages show foundation, question-bank completion, and final assessments. Determined, realistic, culturally neutral.`,
  },
  {
    slug: "most-tested-topics-step-2-ck",
    summary: `A precisely organized clinical flat lay divided into six balanced zones with a stethoscope, surgical clamp, pediatric reflex hammer, prenatal ultrasound probe, plain medication blister, and biostatistics tokens. Blank colored cards unify the specialties into one high-yield review map.`,
    detail: `A medical student leads an integrated review session at a large table where distinct clinical case objects from internal medicine, surgery, obstetrics, pediatrics, psychiatry, and biostatistics surround blank case cards. The composition feels broad but deliberately prioritized.`,
  },
  {
    slug: "step-3-ccs-cases-complete-walkthrough",
    summary: `An unbranded desktop monitor showing an abstract simulated-patient workspace: patient silhouette, vital-sign waves, order tiles, care-setting blocks, and a circular timer, all without readable characters. A hand moves one treatment tile into the correct sequence.`,
    detail: `A resident physician practices a computer-based patient simulation at a workstation. The monitor contains only a patient silhouette, one waveform, five large colored decision tiles, a single arrow pathway, and a clock face with tick marks; avoid menus, calendars, small controls, and document-like layouts.`,
  },
];

export const blogImagePrompts = articles.flatMap((article) => [
  {
    name: `blog-${article.slug}-summary`,
    outputFile: `blog/${article.slug}-summary.webp`,
    size: "1200x630",
    prompt: summaryPrompt(article.summary),
  },
  {
    name: `blog-${article.slug}-detail`,
    outputFile: `blog/${article.slug}-detail.webp`,
    size: "1536x1024",
    prompt: detailPrompt(article.detail),
  },
]);
