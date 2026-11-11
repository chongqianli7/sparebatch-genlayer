# SpareBatch protocol

Network: Stable Studionet, chain ID 61999, RPC `https://studio.genlayer.com/api`. GenLayer JS 1.1.8. GenVM runtime is pinned in the first source line.

## Immutable input and ownership

`open_session(name, payload)` fixes a title, 1–4 distinct named parts with integer stocks 0–100, and 2–6 distinct named jobs with material notes. Names are scoped to the actual transaction sender. No session can be replaced. Every write derives its storage key from the actual sender. `inspect(owner,name)` and `protocol()` are public reads.

No personal contact details or secrets should be supplied: notes and receipts are public. Part units must be indivisible units that match the note. Ambiguous conversion, alternatives and conditional quantities are unknown.

## Consensus

`plan(name)` runs only from OPEN. The leader interprets original part names and notes. The input's stock values are withheld from the model. Every ordered job × part cell has quantity -1 (unknown), 0 (explicit non-use) or 1–100 units. Every nonnegative value requires a verbatim quote from that job's note. A validator independently runs the same interpretation and requires exact equality of the full quantity vector, including excluded jobs. Quote wording may differ. Quote validation alone is insufficient: independent quantity interpretation is mandatory. Invalid JSON, model exceptions and disagreement propagate; they do not create an unknown fallback plan.

## Exact batch

Enumerate all subsets (at most 64), excluding any job containing -1. Reject subsets exceeding any stock. Maximize item count; on a tie, choose the lexicographically smallest ordered job-index list. Zero-based indices are fixed by immutable input order. This is a bounded multidimensional 0/1 resource packing problem, not divisible fair allocation. Save the requirements, selected subset, usage, remainder and review-job indices. A digest commits the input hash, complete quantities and computed plan.

`reserve(name,expected_digest)` accepts only a PLANNED, nonempty batch and the exact digest. It atomically marks chosen jobs RESERVED and initializes available/consumed counters. It cannot accept a caller-selected subset.

`finish_job(name,index,completed)` accepts only a currently RESERVED job in a RESERVED session. Completion adds its full need vector to consumed; cancellation returns that vector to available. Both are terminal for that job. When all selected jobs are terminal, the session becomes CLOSED. Waiting jobs cannot be promoted into this sealed batch. A future batch requires a new session with separately declared stock.

For each part, original stock = available + consumed + quantities still reserved. No transition sends GEN or calls an external contract.

## State transitions

OPEN → PLANNED → RESERVED → CLOSED. An empty plan remains PLANNED and cannot reserve. Uncertainty blocks that job, not the entire session. There is no upgrade method, input-edit method or administrative override.
