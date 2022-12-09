import * as puppeteer from 'puppeteer';
import { processCredits } from './processCredits.js';
import { PreviewsWord } from '../types';

export const previewsWorld = async ({
  diamondNumber,
  page,
}: {
  diamondNumber: string;
  page: puppeteer.Page;
}): Promise<PreviewsWord> => {
  const TITLE_SELECTOR = '.CatalogFullDetail .Title';
  const PUBLISHER_SELECTOR = '.CatalogFullDetail .Publisher';
  const IMAGE_SELECTOR = '.CatalogFullDetail .ImageContainer img';
  const CREATORS_SELECTOR = '.CatalogFullDetail .Creators';
  const RELEASE_DATE_SELECTOR = '.CatalogFullDetail .ReleaseDate';
  const SRP_SELECTOR = '.CatalogFullDetail .SRP';
  const TEXT_SELECTOR = '.CatalogFullDetail .Text';
  try {
    await page.waitForSelector(TITLE_SELECTOR);
    const titleElement = await page.$(TITLE_SELECTOR);
    const titleText = await page.evaluate(
      (el) => el?.textContent?.trim(),
      titleElement
    );
    await page.waitForSelector(PUBLISHER_SELECTOR);
    const publisherElement = await page.$(PUBLISHER_SELECTOR);
    const publisherText = await page.evaluate(
      (el) => el?.textContent?.trim(),
      publisherElement
    );
    await page.waitForSelector(IMAGE_SELECTOR);
    const imageElement = await page.$(IMAGE_SELECTOR);
    const imageURL = await page.evaluate((el) => el?.src, imageElement);
    await page.waitForSelector(CREATORS_SELECTOR);
    const creatorsElement = await page.$(CREATORS_SELECTOR);
    const creatorsText = await page.evaluate(
      (el) => el?.textContent?.trim(),
      creatorsElement
    );
    const creatorBreakdown = processCredits(creatorsText || '');
    await page.waitForSelector(RELEASE_DATE_SELECTOR);
    const releaseDateElement = await page.$(RELEASE_DATE_SELECTOR);
    const releaseDateText = await page.evaluate((el) => {
      const d = new Date(el?.textContent?.split(':')[1] || '');
      return d.toISOString();
    }, releaseDateElement);
    await page.waitForSelector(SRP_SELECTOR);
    const srpElement = await page.$(SRP_SELECTOR);
    const srpText = await page.evaluate(
      (el) => el?.textContent?.split(':')[1].trim(),
      srpElement
    );
    await page.waitForSelector(TEXT_SELECTOR);
    const textElement = await page.$(TEXT_SELECTOR);
    const textText = await page.evaluate((el) => {
      for (const selector of [
        '#PageContent > div.CatalogFullDetail > div.Text > div.ItemCode',
        '#PageContent > div.CatalogFullDetail > div.Text > div.Creators',
        '#PageContent > div.CatalogFullDetail > div.Text > div.ReleaseDate',
        '#PageContent > div.CatalogFullDetail > div.Text > div.SRP',
        '#PageContent > div.CatalogFullDetail > div.Text > a',
        '#PageContent > div.CatalogFullDetail > div.Text > div:nth-child(7)',
        '#PageContent > div.CatalogFullDetail > div.Text > div:nth-child(7) > div.pullboxButtons',
      ]) {
        const element = document.querySelector(selector);
        element?.parentNode?.removeChild(element);
      }
      return el?.textContent
        ?.replace(/ORDER|SUBSCRIBE|WISH LIST|Click to View/g, '')
        .trim();
    }, textElement);
    const textSplit = textText?.split('Rated');
    return {
      DiamondNumber: diamondNumber,
      Title: titleText,
      Publisher: publisherText,
      ImageURL: imageURL,
      Writer: creatorBreakdown.Writer.join(', '),
      Artist: creatorBreakdown.Artist.join(', '),
      'Cover Artist': creatorBreakdown['Cover Artist'].join(', '),
      ReleaseDate: releaseDateText,
      SRP: srpText,
      Text: textSplit?.[0]?.trim(),
      Rated: textSplit?.length === 2 ? `Rated ${textSplit?.[1]?.trim()}` : '',
    };
  } catch {
    console.log(`Diamond Number ${diamondNumber} was not found`);
  }
  return {
    DiamondNumber: diamondNumber,
    Title: `Diamond Number ${diamondNumber} was not found`,
  };
};
