import * as puppeteer from 'puppeteer';
import { previewsWorld } from './previewsWorld.js';
import { sleep } from '../util/sleep.js';
import { PreviewsWord } from '../types';

export const previewsWorldScrape = async (
  diamondNumbers: string[]
): Promise<PreviewsWord[]> => {
  const toReturn = [];
  /**
   * start a new browser
   */
  const browser = await puppeteer.launch();
  /**
   * Loop over all the diamond numbers
   */
  for (const diamondNumber of diamondNumbers) {
    sleep(100);
    /**
     * create a page object through which we will be able to get data
     */
    const previewsWorldPage = await browser.newPage();
    /**
     * navigate to page
     */
    await previewsWorldPage.goto(
      `https://www.previewsworld.com/Catalog/${diamondNumber}`
    );
    console.log(`https://www.previewsworld.com/Catalog/${diamondNumber}`);
    /**
     * do previews world specific stuff
     */
    const previewsWorldScrape = await previewsWorld({
      diamondNumber,
      page: previewsWorldPage,
    });
    toReturn.push(previewsWorldScrape);
    /**
     * close the page
     */
    await previewsWorldPage.close();
  }
  return toReturn;
};
