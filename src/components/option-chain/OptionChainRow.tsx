import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EXPIRY, INSTRUMENT } from '@/constants/optionChain';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { type OrderDraft, type StrikeRow } from '@/types/options';

import { FlashCell } from './FlashCell';

interface OptionChainRowProps {
  row: StrikeRow;
  isATM: boolean;
  onCellPress: (draft: OrderDraft) => void;
}

function formatOI(oi: number): string {
  if (oi >= 1000) return `${(oi / 1000).toFixed(0)}K`;
  return String(oi);
}

export const OptionChainRow = memo(function OptionChainRow({ row, isATM, onCellPress }: OptionChainRowProps) {
  const theme = useTheme();

  // Memoised so FlashCell gets a stable onPress reference between renders.
  // Each callback only changes when the relevant ltp changes — which is also
  // when FlashCell needs to re-render anyway.
  const handlePutPress = useCallback(() => {
    onCellPress({
      instrument: INSTRUMENT,
      expiry: EXPIRY,
      strike: row.strike,
      type: 'PUT',
      quantity: 1,
      price: row.put.ltp,
      orderType: 'LIMIT',
    });
  }, [onCellPress, row.strike, row.put.ltp]);

  const handleCallPress = useCallback(() => {
    onCellPress({
      instrument: INSTRUMENT,
      expiry: EXPIRY,
      strike: row.strike,
      type: 'CALL',
      quantity: 1,
      price: row.call.ltp,
      orderType: 'LIMIT',
    });
  }, [onCellPress, row.strike, row.call.ltp]);

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.backgroundElement },
        isATM && { backgroundColor: Colors.dark.backgroundSelected },
      ]}
    >
      {/* PUT LTP — tappable, flashes */}
      <FlashCell
        value={row.put.ltp}
        prevValue={row.put.prevLtp}
        onPress={handlePutPress}
      />

      {/* PUT OI */}
      <View style={styles.cell}>
        <Text style={[styles.oiText, { color: theme.textSecondary }]}>{formatOI(row.put.oi)}</Text>
      </View>

      {/* STRIKE */}
      <View style={styles.strikeCell}>
        <Text style={[styles.strikeText, isATM && styles.atmText, { color: isATM ? '#ffffff' : theme.text }]}>
          {row.strike}
        </Text>
        {isATM && <Text style={styles.atmBadge}>ATM</Text>}
      </View>

      {/* CALL LTP — tappable, flashes */}
      <FlashCell
        value={row.call.ltp}
        prevValue={row.call.prevLtp}
        onPress={handleCallPress}
      />

      {/* CALL OI */}
      <View style={styles.cell}>
        <Text style={[styles.oiText, { color: theme.textSecondary }]}>{formatOI(row.call.oi)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  strikeCell: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  strikeText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  atmText: {
    color: '#ffffff',
  },
  atmBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#208AEF',
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 2,
    overflow: 'hidden',
  },
  oiText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
