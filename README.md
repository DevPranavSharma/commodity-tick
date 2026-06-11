# Nubra Trading — Mini Option Chain

A React Native / Expo app implementing a Mini Option Chain screen for Crude Oil Mini with live price simulation and a quick-order bottom sheet.

## What I built

### Screen 1 — Option Chain List
- Scrollable table of 7 strikes (5400–5700) with columns: PUT LTP, PUT OI, Strike, CALL LTP, CALL OI
- ATM strike (5500) is visually highlighted with a dark background and an ATM badge
- LTP values simulate live updates every 2 seconds via `setInterval` with small random price changes
- Each LTP cell flashes **green** (price up) or **red** (price down) using a `react-native-reanimated` v4 `withSequence` animation — direction is tracked via a `useSharedValue` to stay safe with the React Compiler

### Screen 2 — Order Form (Bottom Sheet)
- Opens via `@gorhom/bottom-sheet` when a PUT or CALL LTP cell is tapped
- Displays: instrument name, expiry, strike, type badge (PUT/CALL), quantity stepper, pre-filled price, order type toggle (Limit/Market)
- Lot size validation: minimum 1 lot (1 lot = 10 units), submit disabled if quantity < 1
- Submit button is disabled immediately on first tap to prevent duplicate submissions
- On submit: shows a success or failure toast via `react-native-toast-message`, triggers haptic feedback via `expo-haptics`, then dismisses the sheet

## Stack
- **Expo 56** / React Native 0.85 / React 19
- **expo-router** (file-based routing, tabs)
- **react-native-reanimated 4** for LTP flash animations
- **@gorhom/bottom-sheet v5** for the order form
- **expo-haptics** for native haptic feedback
- **react-native-toast-message** for order confirmation toasts
- TypeScript throughout

## Running the app

```bash
npm install
npx expo start
```

Open on an iOS Simulator, Android Emulator, or physical device via Expo Go.

## Trade-offs made

- **Mock submit with 80% success rate** — the spec doesn't define a real API, so I simulate a network call with a random success/failure to exercise both toast paths.
- **Dark theme only** — the option chain screen uses a fixed dark palette rather than responding to the system light/dark toggle. A real app would wire into the existing theme system.
- **OI values are static** — only LTP values update on each tick. In a real feed, OI would also change, but the spec only mentions LTP flashing.
- **No quantity pre-validation on the stepper minimum button** — the `−` stepper clamps to 1 but the raw TextInput still accepts `0`, showing an inline error. This is intentional: it gives power users keyboard control while still blocking invalid submissions.

## One thing I'd improve with more time

**Virtualized column freezing** — on a real option chain with 50+ strikes, the strike column should be sticky/frozen while PUT/CALL columns scroll horizontally. React Native's `FlatList` doesn't support frozen columns natively; I'd implement this with a two-pane layout (fixed strike column + horizontally-scrollable data pane synced via a shared scroll offset `useSharedValue`).

https://github.com/user-attachments/assets/f46e40c5-021c-42a7-aa0a-3d68983bc58c


