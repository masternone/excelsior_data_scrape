import * as puppeteer from 'puppeteer';
import { sleep } from '../util/sleep.js';

export const search = async ({
  diamondNumber,
}: {
  diamondNumber: string;
}): Promise<string> => {
  let toReturn: string = '';
  /**
   * start a new browser
   */
  const browser = await puppeteer.launch();
  /**
   * create a page object through which we will be able to get data
   */
  const googlePage = await browser.newPage();
  /**
   * navigate to page
   */
  await googlePage.goto(`https://www.google.com/`);
  /**
   * find the page
   */
  const search = `${diamondNumber} site:https://www.midtowncomics.com/`;
  const TEXT_SELECTOR = 'input[aria-label="Search"]';
  const SEARCH_BUTTON_SELECTOR = 'input[aria-label="Google Search"]';
  const RESULT_SELECTOR = '#search a';
  try {
    console.log({ search });
    await googlePage.waitForSelector(TEXT_SELECTOR);
    await googlePage.type(TEXT_SELECTOR, search);
    await googlePage.click(SEARCH_BUTTON_SELECTOR);
    sleep(100);
    await googlePage.waitForSelector(RESULT_SELECTOR);
    const resultElement = await googlePage.$(RESULT_SELECTOR);
    const resultURL =
      (await googlePage.evaluate((el) => {
        console.log({ el });
        return el?.href;
      }, resultElement)) || '';
    console.log({ resultURL });
    toReturn = resultURL;
  } catch {
    console.log('issue');
  }
  /**
   * close the page
   */
  await googlePage.close();
  return toReturn;
};
