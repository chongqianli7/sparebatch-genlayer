# Network and application evidence

[Open SpareBatch](https://chongqianli7.github.io/sparebatch-genlayer/) · [Contract](https://explorer-studio.genlayer.com/address/0xAb36AF43c0e364632C1f2bcDe931d18D5f8FF9f2)

Stable Studionet · chain ID 61999 · full consensus, `leaderOnly: false`. The source returned by `gen_getContractCode` matches `contracts/sparebatch.py` exactly. `protocol()` returns `sparebatch-1`.

Source SHA-256: `024c3d109a5df9451e89c6a950d536a167694ddeae6c84a6f235865c2ed1cbdc`.

## Complete inventory lifecycle

The authored textile example selected jobs `[1,2,3]` with quantities `[[2,0],[1,0],[1,0],[0,1]]`. Two jobs were marked completed and one cancelled. The final state is CLOSED; outcomes are WAITING, COMPLETED, CANCELLED, COMPLETED. Available stock `[1,0]` plus consumed stock `[1,1]` equals the original `[2,1]`. No stock remains reserved.

| Operation | Transaction | Observed result |
| --- | --- | --- |
| deployment | [0xaabf7d2280…](https://explorer-studio.genlayer.com/tx/0xaabf7d228061127cc2213f1af80be9a1e20c022249a29a8257dd078524efb63f) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| open_session | [0x5d24b63bc7…](https://explorer-studio.genlayer.com/tx/0x5d24b63bc7c6e8ca92791fb03a0b9f8cd9fb248f19983bb6cb3d94a667bde7a1) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| plan | [0x161f94d88a…](https://explorer-studio.genlayer.com/tx/0x161f94d88afdea8d14d7ba7b00e77f07b1e4ebae53b17943f459f33d7c803236) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| reserve | [0xd2e90c1d57…](https://explorer-studio.genlayer.com/tx/0xd2e90c1d57cba3e97f1fc18b0361fe169ecade5cf976b1a5d20167b850f2ad68) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| finish_job | [0x427b5ee2d0…](https://explorer-studio.genlayer.com/tx/0x427b5ee2d0bbfeb7d48cb46537bfd8244a3fadee687e256c0a87a29e3a67a15b) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| finish_job | [0x6faf8a9620…](https://explorer-studio.genlayer.com/tx/0x6faf8a96201409ad6e79fef1e6b58563e42f651189ae16ab4b6b4f37b75e7868) | FINALIZED / SUCCESS / MAJORITY_AGREE |
| finish_job | [0xe7ccbdf159…](https://explorer-studio.genlayer.com/tx/0xe7ccbdf15926d9fe9d77e36985a8785a9d5885bb9aae6c948e7a8dfb20b7f76e) | FINALIZED / SUCCESS / MAJORITY_AGREE |

Full receipts: `evidence/<transaction-hash>.json`. Finalized readback: [final-record.json](evidence/final-record.json). Read-only verification: `node scripts/verify.mjs` verifies source, receipt identity, exact calldata, agreement, computed batch and inventory conservation. It sends no transactions.

## Public website test

The GitHub Pages application was opened in desktop Chrome. The public example was read without a wallet. A browser-generated test signer then registered `browser-textile-01`, rechecked finalized successful execution and matching state, requested semantic planning through the website, and rechecked the same guarantees. The result was PLANNED with selected jobs `[1,2,3]`. JSON export was downloaded and independently parsed; it contained the stored record, successful finalized receipt and `pending: null`.

| Browser action | Transaction | Result |
| --- | --- | --- |
| Register | [0xc9492120…](https://explorer-studio.genlayer.com/tx/0xc9492120e4d409349547376b717da90206386b622841a62184a01a0ef3f2aeb0) | FINALIZED / SUCCESS |
| Interpret & plan | [0x0c57ff07…](https://explorer-studio.genlayer.com/tx/0x0c57ff07b0831b5d7759845d53268bb616885c1090ec02de85d3412d618aee02) | FINALIZED / SUCCESS |

[Browser export](evidence/browser-export.json) is the actual downloaded application export. This test used a browser test signer, not an external wallet extension. Wallet extension signing, actual mobile devices and physical repairs were not verified. Responsive layout rules are included.

## Local checks and limitations

Nine mocked-host Python checks cover non-greedy optimization, oldest-index ties, unknown exclusion, evidence binding, quantity type checks, inventory conservation, terminal job guards, sender namespace, complete-vector validator disagreement and model failure. Seven JavaScript tests cover planner behavior, draft validation, accepted-versus-finalized handling, legacy receipt decoding and execution checks. Some checks exercise several assertions. `npm run build` succeeds. Local tests do not execute GenVM or real model inference.

All examples, notes and stock counts are authored test data, even when run through real network consensus. They do not establish a real repair session, physical stock or completion. Validators agreed by majority; no unanimity or universally correct interpretation is claimed.
