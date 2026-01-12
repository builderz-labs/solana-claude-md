#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, "..");

const FILES = {
  claude: {
    name: "CLAUDE.md",
    description: "Basic rules & constraints for any AI assistant",
    path: join(packageRoot, "CLAUDE.md"),
  },
  backend: {
    name: "SOLANA_EXPERT_AGENT.md",
    description: "Backend expert (programs, DeFi, security, infrastructure)",
    path: join(packageRoot, "SOLANA_EXPERT_AGENT.md"),
  },
  frontend: {
    name: "SOLANA_FRONTEND_AGENT.md",
    description: "Frontend expert (UI/UX, design systems, accessibility)",
    path: join(packageRoot, "SOLANA_FRONTEND_AGENT.md"),
  },
};

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

function color(text, colorName) {
  return `${COLORS[colorName]}${text}${COLORS.reset}`;
}

function printBanner() {
  console.log();
  console.log(color("  ╔═══════════════════════════════════════════════╗", "magenta"));
  console.log(color("  ║", "magenta") + color("   solana-claude-md                            ", "bright") + color("║", "magenta"));
  console.log(color("  ║", "magenta") + color("   AI assistant config for Solana development  ", "dim") + color("║", "magenta"));
  console.log(color("  ╚═══════════════════════════════════════════════╝", "magenta"));
  console.log();
}

function main() {
  const args = process.argv.slice(2);
  const targetDir = process.cwd();

  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    printBanner();
    console.log("Usage: npx solana-claude-md [options]");
    console.log();
    console.log("Installs AI assistant configuration files for Solana development.");
    console.log("By default, installs all files (skips existing ones).");
    console.log();
    console.log("Options:");
    console.log("  --claude     Install only CLAUDE.md");
    console.log("  --backend    Install only SOLANA_EXPERT_AGENT.md");
    console.log("  --frontend   Install only SOLANA_FRONTEND_AGENT.md");
    console.log("  --force      Overwrite existing files");
    console.log("  --help, -h   Show this help message");
    console.log();
    console.log("Examples:");
    console.log("  npx solana-claude-md              # Install all files");
    console.log("  npx solana-claude-md --force      # Install all, overwrite existing");
    console.log("  npx solana-claude-md --backend    # Install only backend agent");
    console.log();
    process.exit(0);
  }

  printBanner();

  // Handle flags
  const force = args.includes("--force");
  let selectedFiles = [];

  // Check for specific file flags
  if (args.includes("--claude")) selectedFiles.push("claude");
  if (args.includes("--backend")) selectedFiles.push("backend");
  if (args.includes("--frontend")) selectedFiles.push("frontend");

  // Default: install all files
  if (selectedFiles.length === 0) {
    selectedFiles = ["claude", "backend", "frontend"];
  }

  console.log(color("Installing files...", "bright"));
  console.log();

  let installed = 0;
  let skipped = 0;

  for (const key of selectedFiles) {
    const file = FILES[key];
    const targetPath = join(targetDir, file.name);

    // Check if file exists
    if (existsSync(targetPath) && !force) {
      console.log(`  ${color("○", "yellow")}  ${file.name} ${color("(already exists, skipping)", "dim")}`);
      skipped++;
      continue;
    }

    try {
      const content = readFileSync(file.path, "utf-8");
      writeFileSync(targetPath, content);
      const action = existsSync(targetPath) && force ? "overwritten" : "created";
      console.log(`  ${color("✓", "green")}  ${file.name}`);
      installed++;
    } catch (error) {
      console.log(`  ${color("✗", "red")}  ${file.name} - ${error.message}`);
    }
  }

  console.log();

  if (installed > 0) {
    console.log(color(`Installed ${installed} file(s)`, "green") + (skipped > 0 ? color(`, skipped ${skipped}`, "dim") : ""));
    console.log();
    console.log(color("The AI assistant will automatically read these files.", "dim"));
    console.log(color("Docs:", "dim") + " https://github.com/builderz-labs/solana-claude-md");
  } else if (skipped > 0) {
    console.log(color(`All ${skipped} file(s) already exist.`, "yellow"));
    console.log(color("Use --force to overwrite.", "dim"));
  } else {
    console.log(color("No files were installed.", "yellow"));
  }

  console.log();
}

main();
