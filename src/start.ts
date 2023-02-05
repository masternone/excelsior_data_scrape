import { csvToObj } from './read-input.js';
import { previewsWorldScrape } from './previewsWorld/previewsWorldScrape.js';
import { DiamondOrder, LunarOrder, ScrapedData } from './types';
import { PathLike } from 'fs';
import { lunarScrape } from './lunar/lunarScrape.js';
import { objToCsv } from './write-output.js';

const outputColumns = [
  'Product Name',
  'Series',
  'Issue',
  'Variant',
  'Qty',
  'Sell Price',
  'Barcode',
  'UPC',
  'Description',
  'Age',
  'Writer',
  'Artist',
  'Cover Artist',
  'Page Count',
  'Publication Year',
  'Publisher',
  'Release Date',
  'Photo URL',
  'Category',
  'Weight',
  'Condition',
  'Diamond NO',
  'ClzComicID',
  'FOC Date',
];

export const main = async ({
  process,
  path,
}: {
  process: string;
  path: PathLike;
}) => {
  let fileData: any[] = [];
  let scrapedData: ScrapedData[] = [];
  switch (process) {
    case 'Diamond': {
      fileData = await csvToObj<DiamondOrder>(path);
      scrapedData = await previewsWorldScrape(
        fileData.map((line) => line.DiamondNumber)
      );
      break;
    }
    case 'Lunar': {
      fileData = await csvToObj<LunarOrder>(path);
      scrapedData = await lunarScrape(fileData.map((line) => line.UPC));
      objToCsv({
        keys: outputColumns,
        values: scrapedData,
        filename: './data/Lunar_Output.csv',
      });
      break;
    }
    default:
      console.log('invalid process use Diamond or Lunar');
  }
  // console.log({ scrapedData });
};
if (process.argv.length === 4) {
  main({ process: process.argv[2], path: process.argv[3] }).then(() => {
    console.log('end main');
  });
} else {
  console.log('not correct number of arguments');
  console.log('node ./dist/start.js <process> <path/to/data/csv>');
}
