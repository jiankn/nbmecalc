import test from "node:test";
import assert from "node:assert/strict";
import { ALGORITHM_VERSION, computeEstimate, convertExam } from "../index.js";

test("converts representative NBME, UWSA, Free 120, AMBOSS, and CMS inputs", () => {
  assert.equal(ALGORITHM_VERSION, "v1.1");
  assert.equal(convertExam({ source: "NBME", score: 240 }, "step2"), 248);
  assert.equal(convertExam({ source: "UWSA1", score: 250 }, "step2"), 251);
  assert.equal(convertExam({ source: "UWSA2", score: 250 }, "step2"), 253);
  assert.equal(convertExam({ source: "FREE120", score: 75 }, "step2"), 248);
  assert.equal(convertExam({ source: "AMBOSS", score: 65 }, "step2"), 233);
  assert.equal(convertExam({ source: "CMS", score: 70 }, "step2"), 243);
});

test("computes a bounded planning estimate with transparent uncertainty", () => {
  const result = computeEstimate([
    { source: "NBME", score: 240, formNumber: 32, takenDaysAgo: 2 },
    { source: "FREE120", score: 75, takenDaysAgo: 8 },
  ], "step2");

  assert.equal(result.algorithmVersion, "v1.1");
  assert.equal(result.pointEstimate, 249);
  assert.equal(result.ciLower, 239);
  assert.equal(result.ciUpper, 259);
  assert.equal(result.inputCount, 2);
  assert.equal(result.freshness, "fresh");
  assert.ok(result.passProbability > 0 && result.passProbability < 1);
});

test("rejects unsupported or empty input", () => {
  assert.throws(() => convertExam({ source: "unknown", score: 240 }, "step2"), /Unsupported source/);
  assert.throws(() => computeEstimate([], "step2"), /at least one result/);
  assert.throws(() => convertExam({ source: "NBME", score: 240, takenDaysAgo: -1 }, "step2"), /non-negative/);
});
