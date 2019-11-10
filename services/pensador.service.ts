import { Phrase } from '../entities/phrase.model';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer'
import slugify from 'slugify';

export class PensadorService {
  private url: string = 'https://www.pensador.com';

  /**
   * Verify if author exists and return her page
   * 
   * @param authorSlug - Must be slugified "carl-sagan"
   */
  private async getAuthor(authorSlug: string): Promise<Page> {
    const browser: Browser = await puppeteer.launch();

    const page: Page = await browser.newPage();
    await page.goto(this.url);
    const searchBox = await page.$('input[type="text"');
    const unsligifiedAuthorName = authorSlug.replace('-', ' ');
    await searchBox.type(unsligifiedAuthorName);
    await page.click('button[type="submit"');

    const pageAuthorNameElement = await page.$('h1');

    try {
      const pageAuthorSlug: String = (await page.evaluate(element => element.textContent, pageAuthorNameElement)).replace(' ','-');

      if(pageAuthorSlug.toLocaleLowerCase() !== authorSlug.toLowerCase()) {
        throw new Error('artist not founded');
      }
    } catch (err) {
      throw new Error('artist not founded');
    }

    return page;
  }

  async returnRandomPhraseFrom(author: string): Promise<Phrase> {
    const page: Page = await this.getAuthor(author);
    const frasesNode: puppeteer.ElementHandle<Element>[] = await page.$$('.frase');

    let frases = [] as Phrase[];

    for (const frase of frasesNode) {
      const text = await page.evaluate(el => el.innerText, frase);
      frases.push({
        text: text,
        author: author.replace('-',' ')
      });
    }

    page.close();
    return frases[Math.floor(Math.random() * frases.length)];
  }
}
