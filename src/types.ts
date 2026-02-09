export type DasAsset = {
    id: string;
    mint?: string;
    ownership: {
        owner: string;
    };
};

export type CollectionHolder = {
    holder: string;
    count: number;
    nfts: string[]; // asset ids or mint addresses
    hege?:number
};