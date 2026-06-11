import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LOT_SIZE } from '@/constants/optionChain';
import { type OrderDraft, type OrderType } from '@/types/options';

interface OrderFormProps {
  order: OrderDraft;
  onSubmit: (draft: OrderDraft) => Promise<void>;
}

export function OrderForm({ order, onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState(String(order.quantity));
  const [price, setPrice] = useState(String(order.price.toFixed(2)));
  const [orderType, setOrderType] = useState<OrderType>(order.orderType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedQty = parseInt(quantity, 10);
  const isValidQty = !isNaN(parsedQty) && parsedQty >= 1;
  const isDisabled = isSubmitting || !isValidQty;

  async function handlePress() {
    if (isDisabled) return;
    setIsSubmitting(true);
    try {
      const parsedPrice = parseFloat(price);
      await onSubmit({
        ...order,
        quantity: parsedQty,
        // Use parsed price only when it's a valid positive number;
        // parseFloat("0") is 0 which is falsy — explicit isNaN check avoids that trap.
        price: !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : order.price,
        orderType,
      });
    } finally {
      // Reset so the button isn't stuck disabled if the caller throws
      // without closing the sheet.
      setIsSubmitting(false);
    }
  }

  // Gate pluralisation on validity so "–" doesn't render as "–s".
  const lotLabel = isValidQty
    ? `${parsedQty} lot${parsedQty !== 1 ? 's' : ''}`
    : '– lot';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.instrument}>{order.instrument}</Text>
        <Text style={styles.expiry}>{order.expiry}</Text>
      </View>

      {/* Strike + Type badge */}
      <View style={styles.badgeRow}>
        <View style={[styles.typeBadge, order.type === 'PUT' ? styles.putBadge : styles.callBadge]}>
          <Text style={styles.typeBadgeText}>{order.type}</Text>
        </View>
        <Text style={styles.strikeLabel}>Strike {order.strike}</Text>
      </View>

      <View style={styles.divider} />

      {/* Order Type Toggle */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Order Type</Text>
        <View style={styles.toggle}>
          {(['LIMIT', 'MARKET'] as OrderType[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.toggleOption, orderType === t && styles.toggleOptionActive]}
              onPress={() => setOrderType(t)}
            >
              <Text style={[styles.toggleText, orderType === t && styles.toggleTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Quantity */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>
          Quantity{'\n'}
          <Text style={styles.fieldHint}>(lots · 1 lot = {LOT_SIZE})</Text>
        </Text>
        <View style={styles.qtyRow}>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => setQuantity((v) => String(Math.max(1, (parseInt(v, 10) || 1) - 1)))}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <TextInput
            style={styles.qtyInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            maxLength={4}
          />
          <Pressable
            style={styles.qtyBtn}
            onPress={() => setQuantity((v) => String((parseInt(v, 10) || 0) + 1))}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>
      </View>
      {!isValidQty && quantity.length > 0 && (
        <Text style={styles.error}>Minimum 1 lot required</Text>
      )}

      {/* Price — only shown for Limit orders */}
      {orderType === 'LIMIT' && (
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Price (₹)</Text>
          <TextInput
            style={styles.priceInput}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>
      )}

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {lotLabel} × {LOT_SIZE} = {isValidQty ? parsedQty * LOT_SIZE : '–'} units
        </Text>
      </View>

      {/* Submit */}
      <Pressable
        style={[styles.submitBtn, isDisabled && styles.submitBtnDisabled]}
        onPress={handlePress}
        disabled={isDisabled}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? 'Placing Order…' : `Place ${order.type} Order`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 4,
  },
  instrument: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  expiry: {
    fontSize: 13,
    color: '#9BA3AF',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  putBadge: {
    backgroundColor: '#D50000',
  },
  callBadge: {
    backgroundColor: '#00C853',
  },
  typeBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  strikeLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2E3135',
    marginVertical: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#9BA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  fieldHint: {
    fontSize: 11,
    color: '#60646C',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#212225',
    borderRadius: 8,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleOptionActive: {
    backgroundColor: '#208AEF',
  },
  toggleText: {
    color: '#9BA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#212225',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  qtyInput: {
    width: 56,
    paddingVertical: 6,
    backgroundColor: '#212225',
    borderRadius: 8,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  priceInput: {
    width: 100,
    height: 36,
    backgroundColor: '#212225',
    borderRadius: 8,
    color: '#ffffff',
    textAlign: 'right',
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: '#D50000',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    textAlign: 'right',
  },
  summary: {
    backgroundColor: '#212225',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  summaryText: {
    color: '#9BA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#208AEF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#2E3135',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
