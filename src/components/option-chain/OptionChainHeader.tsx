import { StyleSheet, Text, View } from 'react-native';

export function OptionChainHeader() {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.label]}>PUT LTP</Text>
      <Text style={[styles.cell, styles.label]}>PUT OI</Text>
      <Text style={[styles.strikeCell, styles.label]}>STRIKE</Text>
      <Text style={[styles.cell, styles.label]}>CALL LTP</Text>
      <Text style={[styles.cell, styles.label]}>CALL OI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#208AEF',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  strikeCell: {
    flex: 1.2,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
