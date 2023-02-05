import { ScrapedData } from '../types';
import * as puppeteer from 'puppeteer';
import { sleep } from '../util/sleep.js';
import { previewsWorld } from '../previewsWorld/previewsWorld';
import { lunar } from './lunar.js';

export const lunarScrape = async (
  upcNumbers: string[]
): Promise<ScrapedData[]> => {
  const toReturn = [];
  /**
   * start a new browser
   */
  const browser = await puppeteer.launch();
  /**
   * Loop over all the diamond numbers
   */
  for (const upcNumber of upcNumbers) {
    sleep(100);
    /**
     * create a page object through which we will be able to get data
     */
    const lunarPage = await browser.newPage();
    /**
     * navigate to page
     */
    await lunarPage.goto(
      `https://www.lunardistribution.com/home/search?term=${upcNumber}`
    );
    console.log(
      `https://www.lunardistribution.com/home/search?term=${upcNumber}`
    );
    /**
     * do lunar specific stuff
     */
    const lunarScrape = await lunar({
      upcNumber,
      page: lunarPage,
    });
    toReturn.push(lunarScrape);
    /**
     * close the page
     */
    await lunarPage.close();
  }
  return toReturn;
};
