// Centralized prompt manifest for AI image generation.
// Each entry maps to a file in /public/placeholders/*.prompt.txt
// and produces /public/images/<name>.jpg

import { blogImagePrompts } from "./blog-image-prompts.mjs";

export const prompts = [
  // -------- Reviewers (square avatars 1:1) --------
  {
    name: "reviewer-1",
    promptFile: "reviewer-1.prompt.txt",
    size: "1:1",
  },
  {
    name: "reviewer-2",
    promptFile: "reviewer-2.prompt.txt",
    size: "1:1",
  },
  {
    name: "reviewer-3",
    promptFile: "reviewer-3.prompt.txt",
    size: "1:1",
  },

  // -------- Homepage feature cards (4:3) --------
  {
    name: "feature-practice-exams",
    promptFile: "feature-practice-exams.prompt.txt",
    size: "4:3",
  },
  {
    name: "feature-score-range",
    promptFile: "feature-score-range.prompt.txt",
    size: "4:3",
  },
  {
    name: "feature-study-plan",
    promptFile: "feature-study-plan.prompt.txt",
    size: "4:3",
  },

  // -------- Resource Hub blog covers (4:3) --------
  {
    name: "blog-cover-nbme",
    promptFile: "blog-cover-nbme.prompt.txt",
    size: "4:3",
  },
  {
    name: "blog-cover-ci",
    promptFile: "blog-cover-ci.prompt.txt",
    size: "4:3",
  },
  {
    name: "blog-cover-cram",
    promptFile: "blog-cover-cram.prompt.txt",
    size: "4:3",
  },

  // -------- Blog grid covers (16:9) --------
  {
    name: "blog-cram",
    promptFile: "blog-cram.prompt.txt",
    size: "16:9",
  },
  {
    name: "blog-most-tested",
    promptFile: "blog-most-tested.prompt.txt",
    size: "16:9",
  },
  {
    name: "blog-average-lies",
    promptFile: "blog-average-lies.prompt.txt",
    size: "16:9",
  },
  {
    name: "blog-qbanks",
    promptFile: "blog-qbanks.prompt.txt",
    size: "16:9",
  },
  {
    name: "blog-free-120",
    promptFile: "blog-free-120.prompt.txt",
    size: "16:9",
  },
  {
    name: "blog-night-before",
    promptFile: "blog-night-before.prompt.txt",
    size: "16:9",
  },

  // -------- Blog article summary + detail images --------
  ...blogImagePrompts,
];
