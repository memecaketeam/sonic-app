import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState, RootState } from '@/store';
import { Balances, PairBalances, PairList, SupportedTokenList } from '@/models';

export interface SwapCanisterState {
  supportedTokenListState: FeatureState;
  balancesState: FeatureState;
  allPairsState: FeatureState;
  userLPBalancesState: FeatureState;

  supportedTokenList?: SupportedTokenList;
  sonicBalances?: Balances;
  tokenBalances?: Balances;
  allPairs?: PairList;
  userLPBalances?: PairBalances;
}

const initialState: SwapCanisterState = {
  supportedTokenListState: 'loading' as FeatureState,
  balancesState: 'loading' as FeatureState,
  allPairsState: 'loading' as FeatureState,
  userLPBalancesState: 'loading' as FeatureState,

  supportedTokenList: undefined,
  sonicBalances: undefined,
  tokenBalances: undefined,
  allPairs: undefined,
  userLPBalances: undefined,
};

export const swapCanisterSlice = createSlice({
  name: 'swapCanister',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSupportedTokensListState: (
      state,
      action: PayloadAction<FeatureState>
    ) => {
      state.supportedTokenListState = action.payload;
    },
    setBalancesState: (state, action: PayloadAction<FeatureState>) => {
      state.balancesState = action.payload;
    },
    setSupportedTokenList: (
      state,
      action: PayloadAction<SupportedTokenList>
    ) => {
      state.supportedTokenList = action.payload;
    },
    setSonicBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.sonicBalances = parsedBalances;
    },
    setTokenBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.tokenBalances = parsedBalances;
    },
    setAllPairsState: (state, action: PayloadAction<FeatureState>) => {
      state.allPairsState = action.payload;
    },
    setAllPairs: (state, action: PayloadAction<PairList>) => {
      state.allPairs = action.payload;
    },
    setUserLPBalancesState: (state, action: PayloadAction<FeatureState>) => {
      state.userLPBalancesState = action.payload;
    },
    setUserLPBalances: (state, action: PayloadAction<PairBalances>) => {
      state.userLPBalances = action.payload;
    },
  },
});

export const swapCanisterActions = swapCanisterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapCanisterState = (state: RootState) => state.swap;

export default swapCanisterSlice.reducer;
