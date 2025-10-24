import Papa from "papaparse"

export default async function handler(req, res) {
const CSV = "https://docs.google.com/spreadsheet/ccc?key=1C_Rmk0act0Q8VHdjeh0TAsmfbWtvK_P9z25U-7BJW78&output=csv";

    try {
        const response = await fetch(CSV);
        const csvData = await response.text();

        const result = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: (header, index) => {
                if (index === 0) return null; // Skip first column
                // Rename based on position
                const headerMap = ['organization', 'body', 'date', 'time', "location", "cost", "contact", "run_start", "run_end", "email"];
                return headerMap[index - 1] || header;
            }
        });

        // Filter out the null column from each row
        const cleanedData = result.data.slice(1).map(row => {
            const { null: removed, ...rest } = row;
            return rest;
        });

        res.status(200).json({ data: cleanedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
}