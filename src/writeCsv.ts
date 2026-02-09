import fs from "fs";
import type { CollectionHolder } from "./types.js";

function escapeCsv(value: string | number | undefined): string {
    if (value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function writeHoldersCsv(
    holders: CollectionHolder[],
    filePath: string
) {
    const header = ["holder", "count", "hege", "nfts"].join(",");

    const rows = holders.map(h =>
        [
            escapeCsv(h.holder),
            escapeCsv(h.count),
            escapeCsv(h.hege ?? 0),
            escapeCsv(h.nfts.join("|")),
        ].join(",")
    );

    const csv = [header, ...rows].join("\n");

    fs.writeFileSync(filePath, csv, "utf8");
}
