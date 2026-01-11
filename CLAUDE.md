# Solana Development Rules

This file configures AI coding assistants for Solana program development. Follow these rules to produce secure, optimized, and correct code.

## Stack Configuration

Uncomment and configure based on your project:

```en
# Framework: anchor | native | pinocchio | steel
# Client: typescript (@solana/kit) | rust | python
# Testing: mollusk | litesvm | bankrun | anchor-test
# Local: surfpool | solana-test-validator
```

---

## Critical Rules

### NEVER

1. **NEVER use deprecated crates:**

   - `solana-program` < 2.0 → use `solana-program` 2.x or `pinocchio`
   - `solana-sdk` < 2.0 → use `solana-sdk` 2.x
   - `spl-token` < 5.0 → use `spl-token` 5.x or `spl-token-2022`
   - `@solana/web3.js` 1.x → use `@solana/kit` (web3.js 2.0)

2. **NEVER deploy to mainnet without explicit user confirmation** - always ask first

3. **NEVER use unchecked arithmetic:**

   ```rust
   // WRONG
   let total = amount_a + amount_b;

   // CORRECT
   let total = amount_a.checked_add(amount_b).ok_or(ErrorCode::Overflow)?;
   ```

4. **NEVER skip account validation** - every account must be validated for owner, signer status, and PDA derivation

5. **NEVER hardcode keypairs, private keys, or RPC endpoints**

6. **NEVER use `unwrap()` in on-chain program code** - use proper error handling

7. **NEVER assume account data layout** - always deserialize explicitly

### ALWAYS

1. **ALWAYS verify account ownership before reading/writing:**

   ```rust
   if *account.owner != expected_program_id {
       return Err(ProgramError::IncorrectProgramId);
   }
   ```

2. **ALWAYS use canonical bump seeds for PDAs** - store and reuse the bump

3. **ALWAYS set explicit compute unit limits in transactions**

4. **ALWAYS validate all accounts passed to instructions**

5. **ALWAYS calculate rent-exempt minimum for account creation**

6. **ALWAYS simulate transactions before sending to mainnet**

---

## Framework Selection

| Scenario                 | Recommendation   | Reason                            |
| ------------------------ | ---------------- | --------------------------------- |
| Rapid prototyping        | Anchor           | Auto-generated IDL, better DX     |
| Team collaboration       | Anchor           | Standardized patterns             |
| CU optimization critical | Pinocchio        | 80-95% CU reduction               |
| Maximum control needed   | Pinocchio/Native | Zero-copy, no abstractions        |
| Minimal binary size      | Pinocchio        | Smallest footprint                |
| Native + better DX       | Steel            | Balance of control and ergonomics |

### When to Optimize

Start with Anchor. Optimize to Pinocchio/Native when:

- Transaction costs become significant at scale
- CU limits are being hit
- Binary size affects deployment costs
- Maximum throughput is required

---

## Program Patterns

### Account Validation Order

Always validate in this order:

1. Account ownership
2. Signer status
3. PDA derivation
4. Data constraints

### Anchor Pattern

```rust
#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(
        mut,
        has_one = authority,
        constraint = source.amount >= amount @ ErrorCode::InsufficientFunds
    )]
    pub source: Account<'info, TokenAccount>,

    #[account(mut)]
    pub destination: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,

    #[account(
        seeds = [b"vault", source.key().as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}
```

### Native/Pinocchio Pattern

```rust
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let source = next_account_info(accounts_iter)?;
    let authority = next_account_info(accounts_iter)?;

    // 1. Owner check
    if source.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // 2. Signer check
    if !authority.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // 3. PDA verification
    let (expected_pda, bump) = Pubkey::find_program_address(
        &[b"vault", source.key.as_ref()],
        program_id,
    );
    if expected_pda != *vault.key {
        return Err(ProgramError::InvalidSeeds);
    }

    // 4. Data validation
    let source_data = TokenAccount::try_from_slice(&source.data.borrow())?;
    if source_data.amount < amount {
        return Err(ErrorCode::InsufficientFunds.into());
    }

    Ok(())
}
```

### Error Handling

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Insufficient funds for transfer")]
    InsufficientFunds,
    #[msg("Invalid account owner")]
    InvalidOwner,
    #[msg("Unauthorized signer")]
    Unauthorized,
    #[msg("Invalid PDA derivation")]
    InvalidPDA,
}
```

---

## Testing

### Framework Selection

| Framework   | Best For                         | Speed   |
| ----------- | -------------------------------- | ------- |
| Mollusk     | Unit tests, CU benchmarking      | Fastest |
| LiteSVM     | Integration tests, multi-program | Fast    |
| Surfpool    | Mainnet state simulation         | Medium  |
| Anchor test | E2E with TypeScript clients      | Slower  |

### Mollusk Example

```rust
use mollusk_svm::Mollusk;

#[test]
fn test_transfer() {
    let program_id = Pubkey::new_unique();
    let mollusk = Mollusk::new(&program_id, "target/deploy/program");

    let result = mollusk.process_instruction(
        &instruction,
        &[(key, account.clone())],
    );

    assert!(result.program_result.is_ok());
    println!("CUs consumed: {}", result.compute_units_consumed);
}
```

### LiteSVM Example

```rust
use litesvm::LiteSVM;

#[test]
fn test_integration() {
    let mut svm = LiteSVM::new();
    svm.add_program(program_id, "target/deploy/program.so");

    let tx = Transaction::new_signed_with_payer(...);
    let result = svm.send_transaction(tx);

    assert!(result.is_ok());
}
```

### Required Test Coverage

- [ ] All instruction success paths
- [ ] All instruction error paths
- [ ] Account validation failures (wrong owner, missing signer)
- [ ] Arithmetic edge cases (max values, zero, overflow)
- [ ] PDA derivation (correct seeds, wrong seeds)
- [ ] CPI calls (if applicable)

---

## Client Development

### Modern TypeScript Stack

```typescript
import {
  createSolanaRpc,
  sendAndConfirmTransaction,
  getComputeUnitEstimate,
} from "@solana/kit";

// Always simulate first
const simulation = await rpc.simulateTransaction(transaction);
const estimatedCUs = simulation.value.unitsConsumed;

// Set CU limit to 1.2x estimate
const computeBudgetIx = getSetComputeUnitLimitInstruction({
  units: Math.ceil(estimatedCUs * 1.2),
});

// Add priority fee during congestion
const priorityFeeIx = getSetComputeUnitPriceInstruction({
  microLamports: 1000n,
});
```

### Client Generation

```bash
# Generate typed clients from Anchor IDL
npx @codama/cli generate --from anchor-idl.json --to ./generated

# Or with Kinobi
npx kinobi render --idl anchor-idl.json --output ./src/generated
```

### Transaction Best Practices

1. **Simulate before sending** - catch errors early, get accurate CU estimate
2. **Set compute unit limit** - 1.2x simulated usage
3. **Add priority fees** - required during congestion
4. **Use versioned transactions** - enables address lookup tables
5. **Implement retry logic** - exponential backoff for transient failures

---

## Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (unit + integration)
- [ ] Security self-audit complete (see Security section)
- [ ] Compute units optimized (simulate all instructions)
- [ ] No hardcoded addresses or keys
- [ ] Error messages are descriptive
- [ ] Events emitted for important state changes

### Environment Requirements (2025)

```toml
# Cargo.toml
[dependencies]
anchor-lang = "0.31"      # If using Anchor
solana-program = "2.0"    # If using native
pinocchio = "0.7"         # If using Pinocchio

[dev-dependencies]
mollusk-svm = "0.1"
litesvm = "0.4"
```

```
Solana CLI: 2.0.0+
Rust: 1.75.0+ (stable)
Anchor CLI: 0.31.0+ (if using Anchor)
```

### Deployment Commands

```bash
# Build
anchor build  # or cargo build-sbf

# Deploy to devnet (safe for testing)
solana program deploy target/deploy/program.so \
    --url devnet \
    --with-compute-unit-price 1000

# MAINNET - REQUIRES EXPLICIT USER CONFIRMATION
# Ask user before running this command
solana program deploy target/deploy/program.so \
    --url mainnet-beta \
    --with-compute-unit-price 5000
```

---

## Security Checklist

### Account Security

- [ ] Owner check on every account before read/write
- [ ] Signer verification for privileged operations
- [ ] PDA derived with canonical bump (stored, not recalculated)
- [ ] Account discriminator validated (prevents type confusion)
- [ ] No PDA seed collisions between different account types

### Arithmetic Security

- [ ] All math uses `checked_*` or `saturating_*` operations
- [ ] Division checks for zero divisor
- [ ] Casting uses `try_into()` with error handling
- [ ] Token amounts use u64, not floating point

### CPI Security

- [ ] Invoked program ID is verified before CPI
- [ ] Signer privileges not forwarded blindly
- [ ] Returned accounts validated after CPI
- [ ] Reentrancy considered (state committed before CPI)

### Data Security

- [ ] All instruction data validated before use
- [ ] Account data size verified matches expected
- [ ] Strings/vectors have length limits
- [ ] Rent-exempt balance maintained

---

## Common AI Mistakes

### Outdated Libraries

```rust
// WRONG - outdated, larger binary, more CUs
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint;

// CORRECT - modern (2025)
use pinocchio::account_info::AccountInfo;
use pinocchio::entrypoint;
// OR use Anchor
use anchor_lang::prelude::*;
```

### Missing Validation

```rust
// WRONG - no validation
pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
    let source = &mut ctx.accounts.source;
    source.balance -= amount;  // No checks!
    Ok(())
}

// CORRECT - full validation
pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
    let source = &mut ctx.accounts.source;
    require!(source.balance >= amount, ErrorCode::InsufficientFunds);
    source.balance = source.balance.checked_sub(amount)
        .ok_or(ErrorCode::Overflow)?;
    Ok(())
}
```

### Unsafe Unwrap

```rust
// WRONG - panics on error
let data = account.data.borrow();
let parsed: MyStruct = MyStruct::try_from_slice(&data).unwrap();

// CORRECT - propagates error
let data = account.data.borrow();
let parsed = MyStruct::try_from_slice(&data)
    .map_err(|_| ErrorCode::InvalidAccountData)?;
```

### Hardcoded Values

```rust
// WRONG - hardcoded
const ADMIN: Pubkey = pubkey!("ABC123...");

// CORRECT - configurable
#[account]
pub struct Config {
    pub admin: Pubkey,
    pub bump: u8,
}
```

---

## Quick Reference

### Compute Unit Costs (Approximate)

| Operation              | CUs                |
| ---------------------- | ------------------ |
| Basic instruction      | 200                |
| Pubkey creation        | 1,500              |
| SHA256 hash            | 100 per 64 bytes   |
| Account creation       | 2,000              |
| CPI call               | 1,000 + callee CUs |
| Signature verification | 2,000              |

### Transaction Limits

- Max transaction size: 1,232 bytes
- Max accounts per tx: 64 (with lookup tables: 256)
- Max compute units: 1,400,000 (requestable)
- Default compute units: 200,000

### RPC Providers

For production, use paid RPC providers:

- Helius, QuickNode, Triton, Alchemy
- Free tiers will fail under load
- Budget $100-300/month for production apps
