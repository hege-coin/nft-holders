import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export type SplTokenBalance = {
    mint: string;
    owner: string;
    amount: string;        // raw integer amount
    decimals: number;
    uiAmount: number;      // human readable
};

export async function getSplTokenBalance(
    rpcUrl: string,
    wallet: string,
    mint: string
): Promise<number> {
    const connection = new Connection(
        rpcUrl,
        {
            commitment: "confirmed",
            disableRetryOnRateLimit: true,
        }
    );

    const owner = new PublicKey(wallet);
    const tokenMint = new PublicKey(mint);

    const res = await connection.getParsedTokenAccountsByOwner(owner, {
        mint: tokenMint,
    });

    if (res.value.length === 0) return 0;

    return res.value[0].account.data.parsed.info.tokenAmount.uiAmount ?? 0;
}

export async function getSplTokenBalancesBatched(
    rpc:string,
    wallets: string[],
    mint: string,
    decimals = 9 // pass explicitly or fetch once from mint
): Promise<Map<string, number>> {
    const mintKey = new PublicKey(mint);

    // derive ATAs locally (free)
    const atas = wallets.map(wallet => ({
        wallet,
        ata: getAssociatedTokenAddressSync(
            mintKey,
            new PublicKey(wallet),
            true
        ),
    }));

    const connection = new Connection(
        rpc,
        {
            commitment: "confirmed",
            disableRetryOnRateLimit: true,
        }
    );

    const balances = new Map<string, number>();
    const BATCH_SIZE = 100;

    for (let i = 0; i < atas.length; i += BATCH_SIZE) {
        const batch = atas.slice(i, i + BATCH_SIZE);

        const accounts = await connection.getMultipleAccountsInfo(
            batch.map(b => b.ata),
            "confirmed",
        );

        accounts.forEach((acct, idx) => {
            const wallet = batch[idx].wallet;

            if (!acct) {
                balances.set(wallet, 0);
                return;
            }

            // SPL token amount is bytes 64–72 (u64 LE)
            const raw = Number(
                acct.data.readBigUInt64LE(64)
            );

            balances.set(wallet, raw / 10 ** decimals);
        });
    }

    return balances;
}