import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FlashColors } from '@/constants/theme';

interface FlashCellProps {
  value: number;
  prevValue: number;
  onPress: () => void;
}

export function FlashCell({ value, prevValue, onPress }: FlashCellProps) {
  const flashProgress = useSharedValue(0);
  // Store direction as a shared value so the UI-thread worklet always reads
  // the latest direction — avoids stale closure with React Compiler enabled.
  const isUp = useSharedValue(true);

  useEffect(() => {
    if (value !== prevValue) {
      isUp.value = value >= prevValue;
      flashProgress.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 350 }),
      );
    }
    // flashProgress and isUp are reanimated shared values — stable object refs
    // that never change identity, so excluding them from deps is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      flashProgress.value,
      [0, 1],
      ['transparent', isUp.value ? FlashColors.up : FlashColors.down],
    ),
  }));

  return (
    <Animated.View style={[styles.cell, animatedStyle]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <Text style={styles.text}>{value.toFixed(2)}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    borderRadius: 4,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#208AEF',
    textAlign: 'center',
  },
});
