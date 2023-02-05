export interface Dictionary {
  [key: string]: string;
}

export interface Creators {
  Writer: string[];
  Artist: string[];
  CoverArtist: string[];
}

export interface DiamondOrder {
  DiamondNumber: string;
  ProductName: string;
  OrderedQuantity: number;
  UnpickedQuantity: number;
}

export interface LunarOrder {
  Code: string;
  Title: string;
  Qty: number;
  Retail: string;
  Discount: string;
  DiscountedPrice: string;
  Total: string;
  UPC: string;
}

export interface ScrapedData {
  DiamondNumber?: string;
  Title?: string;
  IssueNumber?: string;
  Variant?: string;
  Publisher?: string;
  ImageURL?: string;
  Writer?: string;
  Artist?: string;
  CoverArtist?: string;
  ReleaseDate?: string;
  SRP?: string;
  Text?: string;
  Rated?: string; // this could become a set of fixed values
  UPC?: string;
}
