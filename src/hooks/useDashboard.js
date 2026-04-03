import { useMemo } from 'react';
import { STATS } from '../features/dashboard/components/mockData';

export function useDashboard() {
  return useMemo(() => ({ stats: STATS }), []);
}
