import { getSolanaCollectionHolders } from "./getCollectionHolders.js";
import { getSplTokenBalancesBatched } from "./getSplTokenBalance.js";
import { writeHoldersCsv } from "./writeCsv.js";
import "dotenv/config"

const RPC_URL = process.env.RPC_URL || '';
const COLLECTION_MINT = process.env.COLLECTION_MINT || '';
const HEGE_MINT = process.env.SPL_MINT || '';

console.log('RPC', RPC_URL)

const holders = await getSolanaCollectionHolders(
    RPC_URL,
    COLLECTION_MINT
);

console.log(
    `Testing first ${holders.length} holders out of ${holders.length}`
);

console.log("Unique holders:", holders.length);
console.log(holders);

const wallets = holders.map(h => h.holder);

const balances = await getSplTokenBalancesBatched(
    RPC_URL,
    wallets,
    HEGE_MINT,
    9 // HEGE decimals
);

// 3️⃣ Attach balances back to your existing objects
for (const holder of holders) {
    holder.hege = balances.get(holder.holder) ?? 0;

    console.log(
        `✓ ${holder.holder} → HEGE: ${holder.hege}`
    );
}

console.log(holders);

// 💾 write CSV
writeHoldersCsv(holders, "./hegend_nft_holders.csv");

console.log("CSV written: hegend_nft_holders.csv");
