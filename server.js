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

// import chromium from "@sparticuz/chromium";
// import puppeteer from "puppeteer-core";
const puppeteer = require("puppeteer")

app.get("/api/aspen", async (req, res) => {
    // const browser = await puppeteer.launch({
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     executablePath: await chromium.executablePath(),
    //     headless: chromium.headless,
    // });
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    //   await page.setUserAgent(
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    //   );

    function getColumnOne(row) {
        return `/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[2]/table[2]/tbody/tr[6]/td/div/table/tbody/tr/td/table/tbody/tr[${row}]/td[1]/table/tbody/tr/th`;
    }

    const times = [];

    try {
        // Aspen login
        await page.goto(
            "https://ma-melrose.myfollett.com/aspen-login/?deploymentId=ma-melrose",
            { waitUntil: "networkidle2" }
        );

        // Credentials
        // await page.waitForXPath('//*[@id="username"]', { timeout: 10000 });
        await page.type("#username", "");
        await page.type("#password", "");

        const [loginBtn] = await page.$x(
            "/html/body/go-root/go-login/go-login-container/div/div/div/go-default-login/form/div[4]/div/button"
        );
        await Promise.all([
            loginBtn.click(),
            page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);

        await page.waitForSelector(".navTab", { timeout: 10000 });

        const [myInfo] = await page.$x(
            "/html/body/div[3]/div/table[2]/tbody[3]/tr/td[3]/a"
        );
        await myInfo.click();

        const [currentSchedule] = await page.$x(
            "/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[1]/div/table/tbody/tr[3]/td/div"
        );
        await currentSchedule.click();

        // await page.waitForXPath(
        //     "/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[2]/table[2]",
        //     { timeout: 10000 }
        // );

        for (let i = 2; i < 8; i++) {
            const [el] = await page.$x(getColumnOne(i));
            if (el) {
                const text = await page.evaluate((el) => el.innerText, el);
                const timeText = text.includes("k-") ? text.split("k-")[1] : text;
                times.push(timeText.trim());
            }
        }
    } catch (err) {
        console.error("Error:", err);
        await browser.close();
        return res
            .status(500)
            .json({ error: err.message || "An unexpected error occurred" });
    }

    await browser.close();
    return res.status(200).json({ times });
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});