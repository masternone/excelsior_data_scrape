import { Creators } from '../types';

export const processCredits = (credits: string): Creators => {
  const keys = { W: 'Writer', A: 'Artist', CA: 'Cover Artist', 'A/CA': '' };
  return credits.split('(').reduce(
    (a, c: string) => {
      if (c !== '') {
        const cSplit = c.split(')');
        cSplit[1] = cSplit[1].replace(/\s+/g, ' ').trim();
        switch (cSplit[0]) {
          case 'W':
          case 'A':
          case 'CA':
            const key = keys[cSplit[0]] as 'Writer' | 'Artist' | 'Cover Artist';
            a[key].push(cSplit[1]);
            break;
          case 'A/CA':
            a['Artist'].push(cSplit[1]);
            a['Cover Artist'].push(cSplit[1]);
            break;
          default:
            console.warn(`Key not Found -> ${cSplit[0]}`);
        }
      }
      return a;
    },
    { Writer: [], Artist: [], 'Cover Artist': [] } as Creators
  );
};
