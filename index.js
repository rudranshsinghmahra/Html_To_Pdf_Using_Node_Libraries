const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

async function getTemplateHtml() {
        console.log("Loading template file in memory")

try {
        const htmlFilePath = path.resolve("./samplehtml.html"); // Enter the path of your HTML file here
        return await readFile(htmlFilePath, 'utf8');
} 
catch (err) {
        return Promise.reject("Could not load html template");
    }
}

async function generatePdf() {
        let data = {};
        getTemplateHtml().then(async (res) => {
        // Now we have the html code of our template in res object
        // you can check by logging it on console
        // console.log(res)
        console.log("HandelBars in Action !! Stay Calm")
        const template = hb.compile(res, { strict: true });
        // we have compile our code with handlebars
        const result = template(data);
        const html = result;
        // we are using headless mode
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        // We set the page content as the generated html by handlebars
        await page.setContent(html)
        // We use pdf function to generate the pdf in the same folder as this file.
        await page.pdf({ path: 'converted.pdf', format: 'A4' })
        await browser.close();
        console.log("PDF Generated")
        }).catch(err => {
        console.error(err)
    });
}
generatePdf();