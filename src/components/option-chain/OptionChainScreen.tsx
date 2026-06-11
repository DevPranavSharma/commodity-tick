import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useRef, useState, useCallback, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ATM_STRIKE, useOptionChainData } from '@/hooks/useOptionChainData';
import { type OrderDraft, type StrikeRow } from '@/types/options';

import { OrderBottomSheet } from '../order-form/OrderBottomSheet';
import { OptionChainHeader } from './OptionChainHeader';
import { OptionChainRow } from './OptionChainRow';

export function OptionChainScreen() {
  const { rows } = useOptionChainData();
  const [selectedOrder, setSelectedOrder] = useState<OrderDraft | null>(null);
  const sheetRef = useRef<BottomSheet>(null);

  // Open the sheet whenever an order is selected
  useEffect(() => {
    if (selectedOrder) {
      sheetRef.current?.expand();
    }
  }, [selectedOrder]);

  const handleCellPress = useCallback((draft: OrderDraft) => {
    setSelectedOrder(draft);
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleSubmit = useCallback(async (draft: OrderDraft): Promise<void> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = Math.random() < 0.8;

    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Order Placed',
        text2: `${draft.type} ${draft.strike} × ${draft.quantity} lot${draft.quantity !== 1 ? 's' : ''}`,
        visibilityTime: 3000,
      });
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: 'Please try again.',
        visibilityTime: 3000,
      });
    }

    sheetRef.current?.close();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: StrikeRow }) => (
      <OptionChainRow
        row={item}
        isATM={item.strike === ATM_STRIKE}
        onCellPress={handleCellPress}
      />
    ),
    [handleCellPress],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen title bar */}
      <View style={styles.titleBar}>
        <View>
          <Text style={styles.title}>CRUDEOILM</Text>
          <Text style={styles.subtitle}>Expiry: 19-Jun-2026</Text>
        </View>
        <View style={styles.liveDot}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.strike)}
        renderItem={renderItem}
        extraData={rows}
        ListHeaderComponent={<OptionChainHeader />}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.listContent}
      />

      <OrderBottomSheet
        ref={sheetRef}
        order={selectedOrder}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#212225',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#9BA3AF',
    marginTop: 2,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#212225',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C853',
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
});
