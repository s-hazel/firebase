const Papa = require('papaparse')
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/menu', async (req, res) => {
    const { date } = req.query;

    try {
        const targetUrl = `https://melroseschools.api.nutrislice.com/menu/api/weeks/school/melrose/menu-type/breakfast/2025/10/17/`;
        const response = await fetch(targetUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// install papaparse
app.get('/api/announcements', async (req, res) => {
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

        res.json({ data: cleanedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});