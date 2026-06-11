import { useEffect, useState } from 'react';

import { ATM_STRIKE, EXPIRY, INSTRUMENT, LOT_SIZE } from '@/constants/optionChain';
import { type StrikeRow } from '@/types/options';

// Re-export so existing imports from this file keep working during migration.
export { ATM_STRIKE, EXPIRY, INSTRUMENT, LOT_SIZE };

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

// ~50% chance any individual leg updates per tick.
// Returns the SAME reference when skipping so React.memo bails out.
function applyTick(leg: StrikeRow['put']): StrikeRow['put'] {
  if (Math.random() > 0.5) return leg;
  const delta = (Math.random() - 0.5) * 5;
  const nextLtp = Math.max(0.05, parseFloat((leg.ltp + delta).toFixed(2)));
  return { ltp: nextLtp, oi: leg.oi, prevLtp: leg.ltp };
}

export function useOptionChainData() {
  const [rows, setRows] = useState<StrikeRow[]>(buildInitialRows);

  useEffect(() => {
    // intervalRef not needed — the cleanup closure captures `id` directly.
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((row) => {
          const newPut = applyTick(row.put);
          const newCall = applyTick(row.call);
          // Preserve row reference if nothing changed — React.memo will bail out.
          if (newPut === row.put && newCall === row.call) return row;
          return { ...row, put: newPut, call: newCall };
        }),
      );
    }, TICK_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return { rows };
}
