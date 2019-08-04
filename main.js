const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

async function run() {
    const app = express();
    const port = process.env.port || 8080;
    app.use(cors());
    let url = 'https://www.pensador.com/frases_de_bob_marley/';
    
    const clearText = (text) => text.replace(/<\/?[^>]+(>|$)/g, "");
    const sortPhrase = (itemsList) => itemsList[Math.floor(Math.random() * itemsList.length)];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    app.get('/', async (req, res) => {
        const frasesNode = await page.$$('.frase');
        const sortedNode = sortPhrase(frasesNode);

        const frase = await (await sortedNode.getProperty('innerHTML')).jsonValue();
        res.json(clearText(frase));
    });

    app.listen(port, () => {
        console.log('🔥' + port);
    });
};

run();