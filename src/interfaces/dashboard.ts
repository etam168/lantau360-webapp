import { DataItem } from "./data-item";

export interface DashboardData {
  cards: CardData[];
  rawData: DataItem[];
  barChartData: Option;
}

export interface CardData {
  type: string;
  totalCount: number;
  newCount: number;
}

export interface Option {
  legend: Legend;
  dataset: Dataset;
  grid: Grid;
  xAxis: XAxis;
  series: BarSeries[];
}

interface Legend {
  bottom: number;
  top: number;
  left: number;
  right: number;
}

interface Dataset {
  source: Array<Array<string | number>>;
}

interface Grid {
  left: string;
  right: string;
  bottom: string;
  top: string;
  containLabel: boolean;
}

interface XAxis {
  type: string;
}

interface BarSeries {
  type: string;
}
