# solana-claude-md

A CLAUDE.md configuration file for AI coding assistants building Solana programs.

## The Problem

AI coding assistants frequently make these mistakes when writing Solana code:

- Using outdated libraries (`solana-program` 1.x, `@solana/web3.js` 1.x)
- Missing critical account validation (owner checks, signer checks, PDA verification)
- Using unsafe arithmetic without overflow protection
- Deploying to mainnet without confirmation
- Generating insecure patterns that pass compilation but fail audits

## The Solution

Drop `CLAUDE.md` into your Solana project root. The file configures AI assistants to:

- Use modern libraries (Pinocchio, `solana-program` 2.x, `@solana/kit`)
- Follow security best practices with explicit validation patterns
- Choose appropriate frameworks (Anchor vs Native)
- Test properly with modern tools (Mollusk, LiteSVM)
- Never deploy to mainnet without asking first

## Quick Start

```bash
# Copy to your project
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/solana-claude-md/main/CLAUDE.md

# Or clone and copy
git clone https://github.com/YOUR_USERNAME/solana-claude-md.git
cp solana-claude-md/CLAUDE.md /path/to/your/solana/project/
```

That's it. The AI assistant will automatically read and follow the rules.

## What's Included

| Section             | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| Critical Rules      | NEVER/ALWAYS rules that prevent common mistakes |
| Framework Selection | When to use Anchor vs Pinocchio vs Steel        |
| Program Patterns    | Account validation with code examples           |
| Testing             | Mollusk, LiteSVM, Surfpool guidance             |
| Client Development  | Modern TypeScript patterns with @solana/kit     |
| Deployment          | Pre-flight checklist and mainnet safeguards     |
| Security Checklist  | Comprehensive validation requirements           |
| AI Pitfalls         | Explicit anti-patterns with corrections         |

## Customization

The file is designed to be customized for your project. Common modifications:

### Set Your Stack

Uncomment and configure the stack section at the top:

```markdown
# Framework: anchor

# Client: typescript (@solana/kit)

# Testing: mollusk

# Local: surfpool
```

### Add Project-Specific Rules

Add rules specific to your codebase:

```markdown
## Project Rules

- All PDAs use the seed format: `[b"prefix", user.key().as_ref()]`
- Token amounts are stored as u64 with 9 decimals
- Admin operations require multisig (threshold: 2/3)
```

### Adjust Framework Preference

If your project is Anchor-only or Native-only, simplify the framework section to remove irrelevant patterns.

## Requirements

For the rules to be effective, your development environment should have:

- Solana CLI 2.0.0+
- Rust 1.75.0+
- Anchor CLI 0.31.0+ (if using Anchor)

## Contributing

Contributions welcome! Areas that could use improvement:

- Additional security patterns
- Framework-specific optimizations
- Client SDK patterns (Python, Rust)
- Integration with security scanners

Please open an issue to discuss significant changes before submitting a PR.

## Testing the Rules

To verify the rules are working:

1. Start a new AI coding session in a Solana project with the CLAUDE.md
2. Ask the AI to implement a simple token transfer
3. Check that it:
   - Uses modern libraries (not deprecated ones)
   - Includes proper account validation
   - Uses checked arithmetic
   - Asks before deploying to mainnet

## Resources

- [Pinocchio Guide](https://www.helius.dev/blog/pinocchio) - Zero-copy Solana development
- [Steel Guide](https://www.helius.dev/blog/steel) - Native Rust with better DX
- [Mollusk Testing](https://solana.com/docs/programs/testing/mollusk) - Fast unit testing
- [Solana Security Course](https://solana.com/developers/courses/program-security) - Security fundamentals
- [Surfpool](https://www.helius.dev/blog/surfpool) - Local development with mainnet state

## License

MIT
