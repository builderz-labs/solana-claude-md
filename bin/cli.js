#!/usr/bin/env node

import { createInterface } from "readline";
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
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function color(text, colorName) {
  return `${COLORS[colorName]}${text}${COLORS.reset}`;
}

function printBanner() {
  console.log();
  console.log(color("  ╔═══════════════════════════════════════════════╗", "magenta"));
  console.log(color("  ║", "magenta") + color("   solana-claude-md", "bright") + color("                       ║", "magenta"));
  console.log(color("  ║", "magenta") + color("   AI assistant config for Solana development", "dim") + color("  ║", "magenta"));
  console.log(color("  ╚═══════════════════════════════════════════════╝", "magenta"));
  console.log();
}

function createPrompt() {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function selectFiles(rl) {
  console.log(color("Which files would you like to install?", "bright"));
  console.log();
  console.log(`  ${color("1.", "cyan")} ${color("CLAUDE.md", "bright")} - ${FILES.claude.description}`);
  console.log(`  ${color("2.", "cyan")} ${color("SOLANA_EXPERT_AGENT.md", "bright")} - ${FILES.backend.description}`);
  console.log(`  ${color("3.", "cyan")} ${color("SOLANA_FRONTEND_AGENT.md", "bright")} - ${FILES.frontend.description}`);
  console.log(`  ${color("4.", "cyan")} ${color("All files", "bright")} - Install everything`);
  console.log();

  const answer = await ask(rl, color("Enter your choice (1-4, or comma-separated like 1,2): ", "yellow"));

  if (answer === "4" || answer === "all") {
    return ["claude", "backend", "frontend"];
  }

  const selected = [];
  const choices = answer.split(",").map((c) => c.trim());

  for (const choice of choices) {
    if (choice === "1") selected.push("claude");
    if (choice === "2") selected.push("backend");
    if (choice === "3") selected.push("frontend");
  }

  return [...new Set(selected)]; // Remove duplicates
}

function copyFile(key, targetDir) {
  const file = FILES[key];
  const targetPath = join(targetDir, file.name);

  if (existsSync(targetPath)) {
    console.log(`  ${color("⚠", "yellow")}  ${file.name} already exists, ${color("skipping", "dim")}`);
    return false;
  }

  try {
    const content = readFileSync(file.path, "utf-8");
    writeFileSync(targetPath, content);
    console.log(`  ${color("✓", "green")}  ${file.name} ${color("created", "dim")}`);
    return true;
  } catch (error) {
    console.log(`  ${color("✗", "red")}  Failed to create ${file.name}: ${error.message}`);
    return false;
  }
}

async function confirmOverwrite(rl, existingFiles) {
  if (existingFiles.length === 0) return true;

  console.log();
  console.log(color("The following files already exist:", "yellow"));
  for (const file of existingFiles) {
    console.log(`  - ${file}`);
  }
  console.log();

  const answer = await ask(rl, color("Overwrite existing files? (y/N): ", "yellow"));
  return answer === "y" || answer === "yes";
}

async function main() {
  const args = process.argv.slice(2);
  const targetDir = process.cwd();

  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    printBanner();
    console.log("Usage: npx solana-claude-md [options]");
    console.log();
    console.log("Options:");
    console.log("  --all        Install all files without prompts");
    console.log("  --claude     Install only CLAUDE.md");
    console.log("  --backend    Install only SOLANA_EXPERT_AGENT.md");
    console.log("  --frontend   Install only SOLANA_FRONTEND_AGENT.md");
    console.log("  --force      Overwrite existing files");
    console.log("  --help, -h   Show this help message");
    console.log();
    process.exit(0);
  }

  printBanner();

  // Handle non-interactive flags
  const force = args.includes("--force");
  let selectedFiles = [];

  if (args.includes("--all")) {
    selectedFiles = ["claude", "backend", "frontend"];
  } else if (args.includes("--claude")) {
    selectedFiles.push("claude");
  } else if (args.includes("--backend")) {
    selectedFiles.push("backend");
  } else if (args.includes("--frontend")) {
    selectedFiles.push("frontend");
  }

  // If flags provided specific files, use those
  if (args.some((a) => a.startsWith("--") && a !== "--force")) {
    if (selectedFiles.length === 0) {
      console.log(color("No valid file selection. Use --help for options.", "yellow"));
      process.exit(1);
    }
  }

  const rl = createPrompt();

  try {
    // Interactive selection if no flags
    if (selectedFiles.length === 0) {
      selectedFiles = await selectFiles(rl);

      if (selectedFiles.length === 0) {
        console.log(color("No files selected. Exiting.", "yellow"));
        rl.close();
        process.exit(0);
      }
    }

    // Check for existing files
    const existingFiles = selectedFiles
      .map((key) => FILES[key].name)
      .filter((name) => existsSync(join(targetDir, name)));

    if (existingFiles.length > 0 && !force) {
      const shouldOverwrite = await confirmOverwrite(rl, existingFiles);
      if (!shouldOverwrite) {
        console.log();
        console.log(color("Installation cancelled.", "yellow"));
        rl.close();
        process.exit(0);
      }
    }

    // Copy files
    console.log();
    console.log(color("Installing files...", "bright"));
    console.log();

    let installed = 0;
    for (const key of selectedFiles) {
      const file = FILES[key];
      const targetPath = join(targetDir, file.name);

      // Remove existing if force or confirmed
      if (existsSync(targetPath) && (force || existingFiles.includes(file.name))) {
        // Will overwrite
      }

      try {
        const content = readFileSync(file.path, "utf-8");
        writeFileSync(targetPath, content);
        console.log(`  ${color("✓", "green")}  ${file.name}`);
        installed++;
      } catch (error) {
        console.log(`  ${color("✗", "red")}  ${file.name} - ${error.message}`);
      }
    }

    console.log();
    if (installed > 0) {
      console.log(color(`Successfully installed ${installed} file(s)!`, "green"));
      console.log();
      console.log(color("Next steps:", "bright"));
      console.log(`  1. The AI assistant will automatically read these files`);
      console.log(`  2. Start coding and enjoy better Solana development!`);
      console.log();
      console.log(color("Documentation:", "dim") + " https://github.com/builderz-labs/solana-claude-md");
    } else {
      console.log(color("No files were installed.", "yellow"));
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(color(`Error: ${error.message}`, "red"));
  process.exit(1);
});
