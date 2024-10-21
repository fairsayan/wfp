export interface FcsMetric {
  prevalence: number;
  people: number;
}

export interface FcsInfo {
  fcs: FcsMetric;
  rcsi?: FcsMetric;
  healthAccess?: FcsMetric;
  marketAccess?: FcsMetric;
}
