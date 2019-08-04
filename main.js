const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

async function run() {
    const app = express();
    const port = 8080;
    app.use(cors());
    let url = 'https://www.pensador.com/frases_de_bob_marley/';
    
    const getRandomIndexFrom = (arr) => Math.floor(Math.random() * arr.length);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    app.get('/', async (req, res) => {
        const frasesNode = await page.$$('.frase');
        const frases = await (await frasesNode[getRandomIndexFrom(frasesNode)].getProperty('innerHTML')).jsonValue();
        res.json(frases);
    });

    app.listen(port, () => {
        console.log('🔥' + port);
    });
};

run();