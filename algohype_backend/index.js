const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
async function captureScreenshots(url, res, height = 1080, width = 1920) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const screenshots = {};
    const chunkSize = { width: parseInt(width), height: parseInt(height) };

    try {
        // Check if the URL is provided
        if (!url) {
            throw new Error('URL is required.');
        }

        await page.goto(url, { waitUntil: 'networkidle0' });

        // Get the dimensions of the entire page
        const { width: totalWidth, height: totalHeight } = await page.evaluate(() => ({
            width: document.body.scrollWidth,
            height: document.body.scrollHeight,
        }));

        // Check if height and width are valid
        if (isNaN(chunkSize.width) || isNaN(chunkSize.height) || chunkSize.width <= 0 || chunkSize.height <= 0) {
            throw new Error('Invalid height or width values.');
        }

        // Loop through the page in chunks and capture screenshots
        for (let x = 0; x < totalWidth; x += chunkSize.width) {
            for (let y = 0; y < totalHeight; y += chunkSize.height) {
                await page.setViewport({ width: chunkSize.width, height: chunkSize.height });
                await page.evaluate((x, y) => window.scrollTo(x, y), x, y);

                const screenshotData = await page.screenshot({ encoding: 'base64' });
                screenshots[`${x}_${y}`] = screenshotData;

                console.log(`Captured screenshot at (${x}, ${y})`);
            }
        }

        console.log('Screenshots captured successfully!');
        res.status(200).json({ message: 'Screenshots captured successfully!', screenshots });
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        res.status(400).json({ error: error.message });
    } finally {
        await browser.close();
    }
}

app.post('/process', (req, res) => {
    // Destructure data from the request body
    const { url, height, width } = req.body;

    captureScreenshots(url, res, height, width);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
