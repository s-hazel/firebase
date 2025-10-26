import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

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
    await page.waitForXPath('//*[@id="username"]', { timeout: 10000 });
    await page.type("#username", process.env.ASPEN_USERNAME);
    await page.type("#password", process.env.ASPEN_PASSWORD);

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

    await page.waitForXPath(
      "/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[2]/table[2]",
      { timeout: 10000 }
    );

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
}
