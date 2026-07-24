#!/usr/bin/env node
const { spawnSync } = require("child_process");
const fs = require("fs");

const tsc = spawnSync("node_modules/.bin/tsc", ["--noEmit", "--pretty", "false"], {
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024,
});
fs.writeFileSync("tsc-output.txt", (tsc.stdout || "") + (tsc.stderr || ""));
fs.writeFileSync("tsc-exit.txt", String(tsc.status));

const vite = spawnSync("node_modules/.bin/vite", ["build"], {
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024,
});
fs.writeFileSync("build-output.txt", (vite.stdout || "") + (vite.stderr || ""));
fs.writeFileSync("build-exit.txt", String(vite.status));
