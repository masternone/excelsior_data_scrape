import fs, { PathLike } from 'fs';
import { ScrapedData } from './types';

export const objToCsv = ({
  keys,
  values,
  filename,
}: {
  keys: string[];
  values: ScrapedData[];
  filename: PathLike;
}) => {
  const keyRow = keys.join(',');

  const prepedValues = values.map((value) => {
    return keys.map((key) => {
      switch (key) {
        case 'Product Name':
          return `"${value.Title}"`;
        case 'Issue':
          return `"${value.IssueNumber}"`;
        case 'Variant':
          return `"${value.Variant}"`;
        case 'Sell Price':
          return `"${value.SRP}"`;
        case 'Barcode':
          return `"${value.UPC}"`;
        case 'UPC':
          return `"${value.UPC}"`;
        case 'Description':
          return `"${value.Text?.replace(/"/g, '&quot;')}"`;
        case 'Age':
          return `"${value.Rated || ''}"`;
        case 'Writer':
          return `"${value.Writer}"`;
        case 'Artist':
          return `"${value.Artist}"`;
        case 'Cover Artist':
          return `"${value.CoverArtist}"`;
        case 'Release Date':
          return `"${value.ReleaseDate}"`;
        case 'Publication Year':
          return `"${value.PublicationYear}"`;
        case 'Photo URL':
          return `"${value.ImageURL}"`;
        case 'Publisher':
          return `"${value.Publisher}"`;
        default:
          return '';
      }
    });
  });

  const valuesToWrite = prepedValues
    .reduce(
      (a, c) => {
        a.push(c.join(','));
        return a;
      },
      [keyRow]
    )
    .join('\n');

  fs.writeFile(filename, valuesToWrite, 'utf8', function (err) {
    if (err) {
      console.log(
        'Some error occured - file either not saved or corrupted file saved.'
      );
    } else {
      console.log("It's saved!");
    }
  });
};
