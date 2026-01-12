# solana-claude-md

[![npm version](https://img.shields.io/npm/v/solana-claude-md.svg)](https://www.npmjs.com/package/solana-claude-md)
[![npm downloads](https://img.shields.io/npm/dm/solana-claude-md.svg)](https://www.npmjs.com/package/solana-claude-md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Configuration files for AI coding assistants building Solana applications. Drop these files into your project to get production-ready code from Claude and other AI assistants.

## Files Overview

| File | Purpose | Best For |
|------|---------|----------|
| `CLAUDE.md` | Rules & constraints | Any Solana project (basic safety) |
| `SOLANA_EXPERT_AGENT.md` | Backend expertise | Programs, DeFi, security, infrastructure |
| `SOLANA_FRONTEND_AGENT.md` | Frontend expertise | UI/UX, design systems, accessibility |

## The Problem

AI coding assistants frequently make these mistakes when writing Solana code:

- Using outdated libraries (`solana-program` 1.x, `@solana/web3.js` 1.x)
- Missing critical account validation (owner checks, signer checks, PDA verification)
- Using unsafe arithmetic without overflow protection
- Deploying to mainnet without confirmation
- Generating insecure patterns that pass compilation but fail audits
- Creating inaccessible or poorly designed frontends

## Installation

### Option 1: npm (Recommended)

```bash
npx solana-claude-md
```

This launches an interactive prompt to select which files to install:

```
  ╔═══════════════════════════════════════════════╗
  ║   solana-claude-md                            ║
  ║   AI assistant config for Solana development  ║
  ╚═══════════════════════════════════════════════╝

Which files would you like to install?

  1. CLAUDE.md - Basic rules & constraints for any AI assistant
  2. SOLANA_EXPERT_AGENT.md - Backend expert (programs, DeFi, security)
  3. SOLANA_FRONTEND_AGENT.md - Frontend expert (UI/UX, design)
  4. All files - Install everything

Enter your choice (1-4, or comma-separated like 1,2):
```

#### CLI Options

```bash
# Install all files without prompts
npx solana-claude-md --all

# Install specific files
npx solana-claude-md --claude      # Just CLAUDE.md
npx solana-claude-md --backend     # Just backend agent
npx solana-claude-md --frontend    # Just frontend agent

# Overwrite existing files
npx solana-claude-md --all --force
```

### Option 2: curl (Manual)

```bash
# Basic rules
curl -O https://raw.githubusercontent.com/builderz-labs/solana-claude-md/main/CLAUDE.md

# Backend expert
curl -O https://raw.githubusercontent.com/builderz-labs/solana-claude-md/main/SOLANA_EXPERT_AGENT.md

# Frontend expert
curl -O https://raw.githubusercontent.com/builderz-labs/solana-claude-md/main/SOLANA_FRONTEND_AGENT.md
```

### Option 3: Clone Repository

```bash
git clone https://github.com/builderz-labs/solana-claude-md.git
cp solana-claude-md/*.md /path/to/your/solana/project/
```

---

## CLAUDE.md - Basic Rules

Drop this into any Solana project for immediate safety improvements. The AI assistant will automatically read and follow the rules.

### What It Does

- Uses modern libraries (Pinocchio 0.10, `solana-program` 3.0, `@solana/kit`)
- Follows security best practices with explicit validation patterns
- Chooses appropriate frameworks (Anchor vs Pinocchio vs Steel)
- Tests properly with modern tools (Mollusk, LiteSVM, Trident)
- Never deploys to mainnet without asking first

### Sections Included

| Section | Purpose |
|---------|---------|
| Modern Tooling | Current library versions and alternatives |
| Critical Rules | NEVER/ALWAYS rules that prevent mistakes |
| Framework Selection | When to use Anchor vs Pinocchio vs Steel |
| Program Patterns | Account validation with code examples |
| Testing | Mollusk, LiteSVM, Trident, Surfpool guidance |
| Client Development | Modern TypeScript patterns with @solana/kit |
| Deployment | Pre-flight checklist and mainnet safeguards |
| Security Checklist | Comprehensive validation requirements |
| Known Attacks | Type cosplay, CPI attacks, PDA exploits |

---

## SOLANA_EXPERT_AGENT.md - Backend Expert

Use this for comprehensive backend Solana development including smart contracts, DeFi protocols, and infrastructure.

### What It Covers

| Domain | Capabilities |
|--------|--------------|
| **Programs** | Anchor 0.32, Pinocchio 0.10, Steel 4.0 with full code examples |
| **DeFi** | AMM curves (constant product, CLMM), vault accounting, oracle integration, lending protocols |
| **NFTs** | Metaplex Core, compressed NFTs (cNFTs), royalty enforcement |
| **Testing** | Mollusk unit tests, LiteSVM integration, Trident fuzzing |
| **Infrastructure** | Multi-RPC architecture, transaction landing strategies, Jito bundles |
| **Security** | Attack vectors, economic security, audit preparation |
| **Network** | Firedancer (1M TPS), Alpenglow (150ms finality), swQoS |

### Code Examples Included

- AMM swap calculations with invariant checks
- Vault share accounting (prevents inflation attacks)
- Oracle integration with staleness checks (Pyth, Switchboard)
- Lending protocol interest rate models
- Compressed NFT minting
- Transaction landing strategies

---

## SOLANA_FRONTEND_AGENT.md - Frontend Expert

Use this for beautiful, accessible Solana dApp interfaces with modern design patterns.

### What It Covers

| Domain | Capabilities |
|--------|--------------|
| **Design System** | 8px grid, typography scale, semantic color tokens, dark mode |
| **Components** | shadcn/ui patterns, CVA variants, compound components |
| **Animation** | Framer Motion, micro-interactions (150-250ms), reduced motion support |
| **Solana UI** | Wallet connection, transaction flows, token display, NFT galleries |
| **Accessibility** | WCAG 2.2 AA, focus management, keyboard navigation, screen readers |
| **Performance** | React Server Components, lazy loading, image optimization |
| **Forms** | react-hook-form + zod validation, token inputs, address validation |

### 2026 Design Trends

- **Liquid Glass**: Translucency, blur effects, depth
- **Calm UI**: Larger typography, generous whitespace, soft edges
- **Cognitive Inclusion**: Design for diverse minds (ADHD, autism, dyslexia)
- **Warm Neutrals**: Paper-like tones, reduced eye strain

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | App Router, RSC, Server Actions |
| React | 19 | Server Components, use() hook |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.0 | @theme directive, CSS-first config |
| shadcn/ui | Latest | Radix primitives, CVA variants |
| Framer Motion | Latest | Physics-based animations |

### Components Included

- `WalletButton` - Connection with dropdown menu
- `TransactionDialog` - Full transaction flow with states
- `TokenBalance` - Formatted display with abbreviations
- `AddressDisplay` - Truncation, copy, explorer link
- `NFTGallery` - Grid with lazy loading
- `TokenInput` - Amount input with max/half buttons
- `TransferForm` - Full form with validation

---

## Requirements

### Backend Development

```bash
# CLI Tools
Solana CLI: 3.1.0+ (via agave-install)
Rust: 1.79.0+
Anchor CLI: 0.32.0+ (if using Anchor)
```

```toml
# Cargo.toml (January 2026)
[dependencies]
anchor-lang = "0.32"      # If using Anchor
solana-program = "3.0"    # Or pinocchio for performance
pinocchio = "0.10"        # Zero-copy, minimal CUs
steel = "4.0"             # Native with better DX

[dev-dependencies]
mollusk-svm = "0.7"       # Fast unit testing
litesvm = "0.6"           # Integration testing
trident-fuzz = "0.2"      # Fuzz testing
```

### Frontend Development

```json
// package.json (January 2026)
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@solana/kit": "^2.0.0",
    "@solana/wallet-adapter-react": "^0.15.0",
    "tailwindcss": "^4.0.0",
    "framer-motion": "^11.0.0",
    "class-variance-authority": "^0.7.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0"
  }
}
```

---

## Customization

### Set Your Stack

Uncomment and configure the stack section in CLAUDE.md:

```markdown
# Framework: anchor | pinocchio | steel
# Client: typescript (@solana/kit) | rust | python
# Testing: mollusk | litesvm | trident
# Local: surfpool | solana-test-validator
```

### Add Project-Specific Rules

```markdown
## Project Rules

- All PDAs use the seed format: `[b"prefix", user.key().as_ref()]`
- Token amounts are stored as u64 with 9 decimals
- Admin operations require multisig (threshold: 2/3)
```

---

## Testing the Configuration

### Backend Rules

1. Ask the AI to implement a token transfer
2. Verify it:
   - Uses modern libraries (not deprecated ones)
   - Includes proper account validation
   - Uses checked arithmetic
   - Asks before deploying to mainnet

### Frontend Rules

1. Ask the AI to create a wallet connect button
2. Verify it:
   - Includes proper loading states
   - Has accessibility attributes (aria-*, focus ring)
   - Uses semantic color tokens
   - Handles all states (disconnected, connecting, connected)

---

## Claude Code Agents

These files can be used as Claude Code custom agents for specialized assistance:

```bash
# After adding to your project, the agents are automatically available
# in Claude Code when you reference the files
```

| Agent | Trigger |
|-------|---------|
| Backend Expert | Reference `SOLANA_EXPERT_AGENT.md` |
| Frontend Expert | Reference `SOLANA_FRONTEND_AGENT.md` |

---

## Resources

### Backend

- [Pinocchio Guide](https://www.helius.dev/blog/pinocchio) - Zero-copy Solana development
- [Steel Guide](https://www.helius.dev/blog/steel) - Native Rust with better DX
- [Mollusk Testing](https://solana.com/docs/programs/testing/mollusk) - Fast unit testing
- [Solana Security Course](https://solana.com/developers/courses/program-security) - Security fundamentals
- [Surfpool](https://www.helius.dev/blog/surfpool) - Local development with mainnet state

### Frontend

- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS 4.0](https://tailwindcss.com/blog/tailwindcss-v4) - CSS framework
- [Framer Motion](https://motion.dev) - Animation library
- [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/) - Accessibility guidelines
- [Solana Wallet Adapter](https://solana.com/developers/cookbook/wallets/connect-wallet-react) - Wallet integration

---

## Contributing

Contributions welcome! Areas that could use improvement:

- Additional security patterns
- Framework-specific optimizations
- More component examples
- Python/Rust client patterns
- Integration with security scanners

Please open an issue to discuss significant changes before submitting a PR.

---

## License

MIT
