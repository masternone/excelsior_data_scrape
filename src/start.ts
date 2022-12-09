import { csvToObj } from './read-input.js';
import { previewsWorldScrape } from './previewsWorld/previewsWorldScrape.js';
import { DiamondOrder } from './types';

export const main = async () => {
  const fileData = await csvToObj<DiamondOrder>('./data/Diamond_Order.csv');
  const scrapedData = await previewsWorldScrape(
    fileData.map((line) => line.DiamondNumber)
  );
  console.log({ scrapedData });
};

main().then(() => {
  console.log('end main');
});
