import { useTotalBalances } from '@/hooks/use-balances';
import {
  FeatureState,
  liquidityViewActions,
  swapActions,
  useAppDispatch,
  usePlugStore,
  useSwapStore,
} from '@/store';
import {
  parseResponseAllPairs,
  parseResponseTokenList,
} from '@/utils/canister';
import { useEffect } from 'react';
import { useSwapActor } from '../actor/use-swap-actor';

export const useSwapInit = () => {
  const { getBalances } = useTotalBalances();
  const { principalId, isConnected, state: plugState } = usePlugStore();
  const { supportedTokenListState } = useSwapStore();

  const swapActor = useSwapActor();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      !isConnected &&
      (plugState === FeatureState.Error || plugState === FeatureState.Idle)
    ) {
      dispatch(swapActions.setBalancesState(FeatureState.Idle));
    }
  }, [isConnected, plugState]);

  useEffect(() => {
    if (
      swapActor &&
      principalId &&
      supportedTokenListState !== FeatureState.Loading
    ) {
      getBalances();
    }
  }, [swapActor, principalId, supportedTokenListState]);

  useEffect(() => {
    getSupportedTokenList();
    getAllPairs();
  }, [swapActor]);

  async function getSupportedTokenList() {
    if (swapActor) {
      try {
        dispatch(swapActions.setSupportedTokensListState(FeatureState.Loading));

        const response = await swapActor.getSupportedTokenList();

        if (response) {
          dispatch(
            liquidityViewActions.setTokenList(parseResponseTokenList(response))
          );
          dispatch(swapActions.setSupportedTokenList(response));
        }
        dispatch(swapActions.setSupportedTokensListState(FeatureState.Idle));

        return response;
      } catch (error) {
        console.error('getSupportedTokenList: ', error);
        dispatch(swapActions.setSupportedTokensListState(FeatureState.Error));
      }
    }
  }

  async function getAllPairs() {
    if (swapActor) {
      try {
        dispatch(swapActions.setAllPairsState(FeatureState.Loading));
        const response = await swapActor.getAllPairs();

        if (response) {
          dispatch(swapActions.setAllPairs(parseResponseAllPairs(response)));
        } else {
          throw new Error('No "getAllPairs" response');
        }

        dispatch(swapActions.setAllPairsState(FeatureState.Idle));
      } catch (error) {
        console.error('getAllPairs: ', error);
        dispatch(swapActions.setAllPairsState(FeatureState.Error));
      }
    }
  }
};
