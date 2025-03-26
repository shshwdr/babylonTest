import Papa from "papaparse";

export interface UpgradeData {
    id: string;
    name: string;
    description: string;
}

export function loadUpgradesFromCSV(url: string): Promise<UpgradeData[]> {
    return new Promise((resolve, reject) => {
        Papa.parse<UpgradeData>(url, {
            header: true,
            download: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: reject
        });
    });
}
