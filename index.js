#!/usr/bin/env node

import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import cliProgress from "cli-progress";

ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- PATH ARGUMENT ----------------------
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("\nERROR: No input file or folder provided.\n");
  console.log("Usage:");
  console.log("   compress-audio <file-or-folder-path>\n");
  process.exit(1);
}

const resolvedInput = path.resolve(inputPath);

// ---------------------- QUALITY MAP ----------------------
const QUALITY_MAP = {
  High: "192k",
  Medium: "128k",
  Low: "64k",
};

// ---------------------- ASK QUALITY ----------------------
const { quality } = await inquirer.prompt([
  {
    type: "list",
    name: "quality",
    message: "Choose compression quality:",
    choices: ["High", "Medium", "Low"],
  },
]);

const bitrate = QUALITY_MAP[quality];
console.log(`\nSelected bitrate: ${bitrate}\n`);

// ---------------------- OUTPUT DIR ----------------------
const outputDir = path.join(__dirname, "compressed");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// ---------------------- FILE DISCOVERY ----------------------
function getFiles(target) {
  const stat = fs.statSync(target);

  if (stat.isDirectory()) {
    return fs
      .readdirSync(target)
      .filter((file) => /\.(mp3|wav|flac|aac|m4a)$/i.test(file))
      .map((file) => path.join(target, file));
  }

  return [target];
}

// ---------------------- COMPRESSION WITH PROGRESS BAR ----------------------
function compressAudio(file) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const output = path.join(outputDir, `${base}-compressed.mp3`);

    console.log(`Compressing: ${base}${ext}`);

    const progressBar = new cliProgress.SingleBar(
      {
        format: "[{bar}] {percentage}% | ETA: {eta_formatted}",
        barCompleteChar: "#",
        barIncompleteChar: ".",
        hideCursor: true
      },
      cliProgress.Presets.shades_classic
    );

    progressBar.start(100, 0);

    ffmpeg(file)
      .audioBitrate(bitrate)
      .output(output)
      .outputOptions("-progress", "pipe:2")  // IMPORTANT: enables progress events
      .on("progress", (progress) => {
        if (progress.percent && !isNaN(progress.percent)) {
          progressBar.update(Math.floor(progress.percent));
        }
      })
      .on("end", () => {
        progressBar.update(100);
        progressBar.stop();
        console.log(`DONE -> ${output}\n`);
        resolve();
      })
      .on("error", (err) => {
        progressBar.stop();
        console.error(`Failed: ${file}\n`, err);
        reject(err);
      })
      .run();
  });
}

// ---------------------- EXECUTE ----------------------
const files = getFiles(resolvedInput);

console.log(`Found ${files.length} audio file(s).\n`);

for (const file of files) {
  await compressAudio(file);
}

console.log("All files compressed successfully.\n");
console.log(`Saved in: ${outputDir}\n`);
