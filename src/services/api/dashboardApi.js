import { httpClient } from '../http/httpClient';

export function getDashboardSummary() {
  return httpClient('/api/dashboard/summary');
}
