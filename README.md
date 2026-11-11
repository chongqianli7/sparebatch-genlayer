# SpareBatch

[Open the repair desk](https://chongqianli7.github.io/sparebatch-genlayer/) · [Contract source](contracts/sparebatch.py) · [Protocol](PROTOCOL.md)

**Make more mends.** A parts-planning desk for small community repair sessions. The organizer records the available stock and each item's declared material requirements. GenLayer independently interprets every job × part; exact subset enumeration finds the largest feasible batch. The organizer reserves that plan, then completes or cancels individual jobs without double-counting parts.

## A small table, a real trade-off

A coat needs two buttons. A shirt and cardigan need one each. A bag needs one zipper pull. With two buttons and one pull, taking the coat first repairs only two items. SpareBatch selects the shirt, cardigan and bag: three repairs with the same stock.

The textile example is an authored demonstration, including when executed on Studionet. It is not a claim that a physical repair event took place. The offline desk uses fixed example interpretations; custom notes are interpreted only by the deployed contract.

## Use the application

1. Try **Offline practice**: change the button stock or make a quantity uncertain and inspect the batch.
2. Open **On chain → Read finalized example** for a public session without a wallet. Read-only inspection does not itself prove a particular transaction's finality.
3. Connect an injected EVM wallet on Stable Studionet 61999. A separate **browser test signer** is available for disposable testnet experiments; its private key remains in local browser storage, is distinct from a wallet and must never hold assets.
4. Choose **Use signer as owner**, enter a new session ID and edit the session JSON. Declare every part quantity, including exclusions. **Validate draft** checks structure; **Seal session** fixes the input.
5. **Recheck transaction** until finalized successful execution and matching state are confirmed. Then **Interpret & plan**, recheck, inspect the quantities and exact source excerpts, and **Reserve exact batch**.
6. Complete selected repairs to consume parts, or cancel to release them. Recheck each transition. Export the record and receipt as JSON.

Pending intent and transaction hashes survive reload. Recheck never sends a transaction. An uncertain wallet response stays blocked until its exact hash is recovered from wallet activity. A rejected signature releases the pending guard. No automatic retries, appeals or redeployments.

## Why GenLayer

Participants can independently read the same immutable input, agreed requirements, selected subset and inventory transitions. The organizer cannot reserve a hand-picked lower-throughput batch or silently change quantities after planning. Validators independently interpret original notes and compare the entire quantity vector; exact evidence-substring checks bind every nonnegative quantity to its own note. The model does not choose the batch.

## Limits

Inventory and notes are organizer declarations, not independently authenticated physical facts. Stock is scoped to one session; separate sessions do not share an inventory pool. This is not diagnosis, a repair guarantee, a professional safety assessment, an escrow or a payment system. An organizer can misstate stock or completion. Shared execution constrains the ledger and plan; it cannot enforce physical work. Unclear jobs are excluded from planning rather than assigned guessed quantities. The maximizing rule can defer an earlier resource-intensive job. At most six jobs and four part types per session.

## Development

Node.js 22+ and Python 3.12+. `npm ci`, `npm test`, `python3 tests/contract_test.py`, `npm run build`. Serve `dist/` as a static site. The tracked `docs/` directory contains the GitHub Pages build; rebuild it after source changes. No paid API key, server, backend or server-held user wallet is required.

See [deployment.json](deployment.json) and [EVIDENCE.md](EVIDENCE.md) for the deployed address and observed network results. Local contract tests use a mocked host; they do not execute GenVM or real model consensus.
