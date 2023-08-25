const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// URLs to scrape
const urls = [
    {
        "Ritz Carlton": ""
    },
    {
        "Four Seasons": [
            {
                "base_URL": "https://www.fourseasons.com/",
                "all_hotels": "https://www.fourseasons.com/find_a_hotel_or_resort/",
            }
        ]
    }
];

// scrape Four Seasons hotel data from website and export to json file
async function scrapeFourSeasons(url) {
    // output folder to write json file
    const outputDir = './JSON/';
    // output file name
    const outputFile = 'four-seasons.json';
    
    // check if output folder exists
    if (!fs.existsSync(outputDir)) {
        // create output folder
        fs.mkdirSync(outputDir);
    }
    // if output folder and has JSON file, delete JSON file
    if (fs.existsSync(outputDir + outputFile)) {
        fs.unlinkSync(outputDir + outputFile);
        console.log("File deleted! Deleted file before new write..\n")
    }

    const browser = await puppeteer.launch({
        headless: true,
        // browser window width large enough to see all data
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/77.0.3865.90 Chrome/77.0.3865.90 Safari/537.36');

    await page.goto(url);

    // wait for element to load
    await page.waitForSelector('a.CTA.CTA--underlined--light.LinksList-link');

    // get hotel data from website
    const html = await page.content();
    const $ = cheerio.load(html);
    
    const hotelData = [];

    $('a.CTA.CTA--underlined--light.LinksList-link').each(function () {
        let hotel = $(this).text();
        let hotelLink = $(this).attr('href');

        // if hotelLink starts with '/', remove it
        if (hotelLink.charAt(0) === '/') {
            hotelLink = hotelLink.substring(1);
        }

        hotelData.push({
            name: hotel,
            link: hotelLink,
            fullLink: urls[1]["Four Seasons"][0]["base_URL"] + hotelLink
        });
    });

    // write hotel data to json file
    fs.writeFile(outputDir + outputFile, JSON.stringify(hotelData, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log("File successfully written!");
        }
    });

    await browser.close();
}

// call function to scrape Four Seasons hotel data and export to json file
// scrapeFourSeasons(urls[1]["Four Seasons"][0]["all_hotels"]);

// go to each Four Seasons hotel page and scrape hotel data
async function scrapeFourSeasonsHotelData(hotelJSON) {}