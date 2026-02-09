# Hegends Solana Snapshot Tool

A small TypeScript utility to:

- Fetch **all holders of a Solana NFT collection**
- Count **NFTs per holder**
- Fetch **SPL token balances (HEGE)** for those holders
- Export the result to **CSV**

Designed to work on **public RPC** using batching to avoid rate limits.

---

## What this does

For a given NFT collection:
1. Pulls all NFTs via **Helius DAS**
2. Groups them by owner
3. For each holder:
    - wallet or program address
    - number of NFTs
    - list of NFT IDs
    - HEGE token balance
4. Writes everything to a CSV file

---

## Requirements

- Node.js **18+**
- npm
- Solana RPC endpoint (public or paid)
- Helius API access (for DAS)

---

## Install

```bash
npm install
```

## Run

```bash
npm start
```