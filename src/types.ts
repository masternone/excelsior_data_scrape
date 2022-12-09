export interface Dictionary {
  [key: string]: string;
}

export interface Creators {
  Writer: string[];
  Artist: string[];
  'Cover Artist': string[];
}

export interface DiamondOrder {
  DiamondNumber: string;
  ProductName: string;
  OrderedQuantity: number;
  UnpickedQuantity: number;
}

export interface PreviewsWord {
  DiamondNumber: string;
  Title?: string;
  Publisher?: string;
  ImageURL?: string;
  Writer?: string;
  Artist?: string;
  'Cover Artist'?: string;
  ReleaseDate?: string;
  SRP?: string;
  Text?: string;
  Rated?: string; // this could become a set of fixed values
}
