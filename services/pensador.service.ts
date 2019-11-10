import { Phrase } from '../entities/phrase.model';
import { Browser, Page, ElementHandle } from 'puppeteer'

export class PensadorService {
  private url: string = 'https://www.pensador.com';

  /**
   * Verify if author exists and return her page
   * 
   * @param authorSlug - Must be slugified "carl-sagan"
   */
  private async getAuthor(browser: Browser, authorSlug: string): Promise<Page> {
   

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

  async returnRandomPhraseFrom(browser: Browser, author: string): Promise<Phrase> {
    const page: Page = await this.getAuthor(browser, author);
    const frasesNode: ElementHandle<Element>[] = await page.$$('.frase');

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
