import { Phrase } from './entities/phrase.model';
import { PensadorService } from './services/pensador.service';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Browser } from 'puppeteer';
import * as puppeteer from 'puppeteer';

run();

async function run() {
  const app = express();
  const port = process.env.PORT || 8080;
  const browser: Browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
  
  app.use(cors());
  app.use(bodyParser());
  
  app.get('', (req, res) => {
    res.write(`
    <html>
    <style>
      * {
        font-family: arial;
        font-size: 22px;
      }
    </style>
    <meta charset="utf-8">
      <b> 👉 <a href="https://github.com/vitorpiovezam/pensador-api"> repo</a></b>  
    </html>
    `);
  });
  
  app.get('/:artist', async (req, res) => {
    const author: string = req.params.artist;
    const phrase: Phrase = await new PensadorService().returnRandomPhraseFrom(browser, author);
    res.send(phrase.text);
  });
  
  app.listen(port, () => {
    console.log('Listeing on port ' + port);
  });
}

