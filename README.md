# Platform Tutorial Testing

Repository for testing [docs.dash.org](https://docs.dash.org/projects/platform/en/stable/docs/tutorials/introduction.html) JavaScript tutorials.

[![Evo-SDK Version](https://img.shields.io/github/package-json/dependency-version/thephez/platform-tutorial-testing/@dashevo/evo-sdk)](https://github.com/thephez/platform-tutorial-testing/blob/main/package.json)
[![Node.js CI](https://github.com/thephez/platform-tutorial-testing/workflows/Node.js%20CI/badge.svg)](https://github.com/thephez/platform-tutorial-testing/actions?query=workflow%3A%22Node.js+CI%22)

## Install

```shell
npm install
```

## Usage

### Evo-SDK Tutorials

Create a `.env` file with `NETWORK` set to a network type (defaults to `testnet`). Read-only
tutorials (identity retrieval, name resolution, contract queries, etc.) work without credentials.

For write tutorials (document submission, contract registration, name registration, etc.), also set:

| Variable | Description |
| --- | --- |
| `IDENTITY_ID` | Your identity ID |
| `PRIVATE_KEY_WIF` | WIF for a CRITICAL or HIGH authentication key |
| `IDENTITY_PUBLIC_KEY_ID` | Key ID with CRITICAL or HIGH security level (default: 1) |
| `TRANSFER_KEY_WIF` | WIF for the TRANSFER key (credit transfers/withdrawals) |
| `MASTER_KEY_WIF` | WIF for the MASTER key (identity updates, key ID 0) |

See [.env.example](./.env.example) for a complete example.

### Test Scripts

| Script | Description |
| --- | --- |
| `npm test` | Run all evo-sdk tests (tutorials + queries) |
| `npm run test:tutorials` | Run tutorial tests |
| `npm run test:queries` | Run query tests |
| `npm run test:deprecated:integration` | Run deprecated js-dash-sdk integration tests |
| `npm run test:deprecated:queries` | Run deprecated js-dash-sdk query tests |


### Interactive Docs PoC

A Docusaurus + lightweight in-page runner (Sandpack) proof of concept is available in [`docs-poc/docusaurus-stackblitz`](./docs-poc/docusaurus-stackblitz).

### Deprecated Tutorials (js-dash-sdk)

Deprecated tutorials remain in `tutorials/js-dash-sdk-deprecated/` for reference. These require
`WALLET_MNEMONIC` set to a valid wallet mnemonic that you will fund, `NETWORK` set to a network
type (mainnet, testnet, or local), and `SYNC_START_HEIGHT` set to the height at which to begin the
wallet sync process.

## Contributing

PRs accepted.

## License

MIT © thephez
