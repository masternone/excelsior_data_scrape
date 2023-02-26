import * as puppeteer from 'puppeteer';
import { processCredits } from '../previewsWorld/processCredits.js';
import { ScrapedData } from '../types';
import { processText } from '../previewsWorld/processText.js';
import { Puppeteer } from 'puppeteer';

export const lunar = async ({
  upcNumber,
  page,
}: {
  upcNumber: string;
  page: puppeteer.Page;
}): Promise<ScrapedData> => {
  const DATA_TRIGGER = '.productitem';
  const TITLE_SELECTOR = '#ptitle';
  // const PUBLISHER_SELECTOR = '.CatalogFullDetail .Publisher';
  const IMAGE_SELECTOR = '#pimg';
  const CREATORS_SELECTOR = '#pcreators';
  const RELEASE_DATE_SELECTOR = '#pinstore';
  const SRP_SELECTOR = '#pretail';
  const TEXT_SELECTOR = '#pdesc';
  try {
    await page.waitForSelector(DATA_TRIGGER);
    await page.click(DATA_TRIGGER);
    await page.waitForSelector(TITLE_SELECTOR);
    const titleElement = await page.$(TITLE_SELECTOR);
    const [titleText, issueNumber, variant] = await page.evaluate((el) => {
      const title = el?.textContent?.trim() || '';
      const match = title.includes('CVR')
        ? title.match(/#(\d+)(.*CVR (\S+))?/)
        : title.includes('VAR')
        ? title.match(/#(\d+)(.*(VAR)$)?/)
        : '';
      return [title, match?.[1] || '1', match?.[3] || 'A'];
    }, titleElement);
    // await page.waitForSelector(PUBLISHER_SELECTOR);
    // const publisherElement = await page.$(PUBLISHER_SELECTOR);
    // const publisherText = await page.evaluate(
    //   (el) => el?.textContent?.trim(),
    //   publisherElement
    // );
    await page.waitForSelector(IMAGE_SELECTOR);
    const imageElement = (await page.$(
      IMAGE_SELECTOR
    )) as puppeteer.ElementHandle<HTMLImageElement> | null;
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
      const d = new Date(el?.textContent || '');
      // return d.toISOString();
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }, releaseDateElement);
    await page.waitForSelector(SRP_SELECTOR);
    const srpElement = await page.$(SRP_SELECTOR);
    const srpText = await page.evaluate(
      (el) => el?.textContent || '',
      srpElement
    );
    await page.waitForSelector(TEXT_SELECTOR);
    const textElement = await page.$(TEXT_SELECTOR);
    const textText = await page.evaluate(
      (el) => el?.textContent?.trim(),
      textElement
    );
    return {
      UPC: upcNumber,
      Title: titleText,
      IssueNumber: issueNumber,
      Variant: variant,
      ImageURL: imageURL,
      Writer: creatorBreakdown.Writer.join(', '),
      Artist: creatorBreakdown.Artist.join(', '),
      CoverArtist: creatorBreakdown['CoverArtist'].join(', '),
      ReleaseDate: releaseDateText,
      PublicationYear: new Date(releaseDateText).getFullYear().toString(),
      SRP: srpText,
      Text: textText,
    };
  } catch {
    console.log(`UPC Number ${upcNumber} was not found`);
  }
  return {
    UPC: upcNumber,
    Title: `UPC Number ${upcNumber} was not found`,
  };
};
