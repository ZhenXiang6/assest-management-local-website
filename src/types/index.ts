export interface Asset {
  id: string;
  name: string;
  category: string;
  value: number;
  currency: string;
  date?: string;
}

export interface HistoricalData {
  date: string;
  totalValue: number;
  [category: string]: number | string;
}
