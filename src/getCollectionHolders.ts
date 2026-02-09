import {CollectionHolder, DasAsset} from "./types.js";

export async function getSolanaCollectionHolders(
    url: string,
    collectionMint: string
): Promise<CollectionHolder[]> {

    const body = {
        jsonrpc: "2.0",
        id: "holders",
        method: "getAssetsByGroup",
        params: {
            groupKey: "collection",
            groupValue: collectionMint,
            page: 1,
            limit: 1000
        }
    };

    // holder => list of nft ids
    const holderMap = new Map<string, string[]>();

    let page = 1;

    while (true) {
        body.params.page = page;

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const json = await res.json();

        const items: DasAsset[] = json.result?.items ?? [];
        if (items.length === 0) break;

        for (const asset of items) {
            const owner = asset.ownership.owner;

            // prefer mint when available, fallback to asset id
            const nftId = asset.mint ?? asset.id;

            if (!holderMap.has(owner)) {
                holderMap.set(owner, []);
            }

            holderMap.get(owner)!.push(nftId);
        }

        page++;
    }

    // convert map → structured output
    return Array.from(holderMap.entries()).map(
        ([holder, nfts]) => ({
            holder,
            count: nfts.length,
            nfts,
        })
    );
}

