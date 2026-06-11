import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useMemo, useCallback } from 'react';

import { type OrderDraft } from '@/types/options';

import { OrderForm } from './OrderForm';

interface OrderBottomSheetProps {
  order: OrderDraft | null;
  onDismiss: () => void;
  onSubmit: (draft: OrderDraft) => Promise<void>;
}

export const OrderBottomSheet = forwardRef<BottomSheet, OrderBottomSheetProps>(
  function OrderBottomSheet({ order, onDismiss, onSubmit }, ref) {
    const snapPoints = useMemo(() => ['62%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onDismiss}
        // Let the sheet handle keyboard avoidance natively — avoids the
        // double-offset issue that KeyboardAvoidingView causes inside a sheet.
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: '#161618' }}
        handleIndicatorStyle={{ backgroundColor: '#4B5563' }}
      >
        <BottomSheetScrollView keyboardShouldPersistTaps="handled">
          {order && <OrderForm order={order} onSubmit={onSubmit} />}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);
