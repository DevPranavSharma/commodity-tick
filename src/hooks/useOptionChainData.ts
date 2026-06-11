import { useEffect, useRef, useState } from 'react';

import { type StrikeRow } from '@/types/options';

export const ATM_STRIKE = 5500;
export const LOT_SIZE = 10;
export const INSTRUMENT = 'CRUDEOILM';
export const EXPIRY = '19-Jun-2026';

const TICK_INTERVAL_MS = 2000;

interface SeedStrike {
  strike: number;
  put: { ltp: number; oi: number };
  call: { ltp: number; oi: number };
}

const INITIAL_STRIKES: SeedStrike[] = [
  { strike: 5400, put: { ltp: 12.5, oi: 45000 }, call: { ltp: 118.0, oi: 12000 } },
  { strike: 5450, put: { ltp: 18.0, oi: 38000 }, call: { ltp: 95.5, oi: 15000 } },
  { strike: 5500, put: { ltp: 28.5, oi: 72000 }, call: { ltp: 72.0, oi: 72500 } },
  { strike: 5550, put: { ltp: 45.0, oi: 18000 }, call: { ltp: 51.5, oi: 41000 } },
  { strike: 5600, put: { ltp: 68.0, oi: 9000 }, call: { ltp: 32.0, oi: 55000 } },
  { strike: 5650, put: { ltp: 95.5, oi: 5000 }, call: { ltp: 18.5, oi: 68000 } },
  { strike: 5700, put: { ltp: 128.0, oi: 2000 }, call: { ltp: 9.0, oi: 82000 } },
];

function buildInitialRows(): StrikeRow[] {
  return INITIAL_STRIKES.map((s) => ({
    strike: s.strike,
    put: { ltp: s.put.ltp, oi: s.put.oi, prevLtp: s.put.ltp },
    call: { ltp: s.call.ltp, oi: s.call.oi, prevLtp: s.call.ltp },
  }));
}

function applyTick(leg: StrikeRow['put']): StrikeRow['put'] {
  const delta = (Math.random() - 0.5) * 5;
  const nextLtp = Math.max(0.05, parseFloat((leg.ltp + delta).toFixed(2)));
  return { ltp: nextLtp, oi: leg.oi, prevLtp: leg.ltp };
}

export function useOptionChainData() {
  const [rows, setRows] = useState<StrikeRow[]>(buildInitialRows);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          put: applyTick(row.put),
          call: applyTick(row.call),
        })),
      );
    }, TICK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { rows };
}
