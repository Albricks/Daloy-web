export interface AdminDashboardChartsDto {
  weeklyActiveLearners: ChartSeriesDto;
  moduleCompletionDistribution: ChartSeriesDto;
  videoCompletionDistribution: ChartSeriesDto;
}

export interface ChartSeriesDto {
  labels: string[];
  values: number[];
}
