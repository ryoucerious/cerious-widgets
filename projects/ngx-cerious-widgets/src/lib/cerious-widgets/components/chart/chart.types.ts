/** One named data series for a line/area chart. */
export interface CwChartSeries {
  /** Series name (shown in legends). */
  name: string;
  /** CSS colour for the line/area. */
  color: string;
  /** The y-values, one per x-label. */
  data: number[];
}

/** One slice of a donut/pie chart. */
export interface CwDonutSegment {
  label: string;
  value: number;
  /** CSS colour for the slice. */
  color: string;
}
