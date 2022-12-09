import { open } from 'node:fs/promises';
import { PathLike } from 'fs';
import { Dictionary } from './types';
import { UCFirst } from './util/UCFirst.js';

export const csvToObj = async <T extends {}>(filename: PathLike) => {
  let columnNames: string[] | undefined;
  const toReturn = [];
  const fileToRead = await open(filename);
  for await (const line of fileToRead.readLines()) {
    if (columnNames === undefined) {
      columnNames = line.split(',').map((columnName) =>
        columnName
          .split(' ')
          .map((word) => UCFirst(word))
          .join('')
      );
      console.log({ columnNames });
    } else {
      const translated = {} as T;
      line
        .replace(/".*(,).*"/g, (a, b) => {
          return a.replace(/,/g, '_');
        })
        .replace(/"/g, '')
        .split(',')
        .forEach((value, index) => {
          // @ts-ignore
          translated[columnNames![index]] = value.replace(/_/g, ',').trim();
        });
      toReturn.push(translated);
    }
  }
  return toReturn;
};
