export type OptionType = 'PUT' | 'CALL';
export type OrderType = 'MARKET' | 'LIMIT';

export interface OptionLeg {
  ltp: number;
  oi: number;
  prevLtp: number;
}

export interface StrikeRow {
  strike: number;
  put: OptionLeg;
  call: OptionLeg;
}

export interface OrderDraft {
  instrument: string;
  expiry: string;
  strike: number;
  type: OptionType;
  quantity: number;
  price: number;
  orderType: OrderType;
}
