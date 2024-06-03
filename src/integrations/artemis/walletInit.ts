import { useEffect } from 'react';
import { useAppDispatch, walletActions, walletState } from '@/store';
import {Artemis} from 'artemis-web3-adapter';

import { tokenList } from '@/utils'
import { ENV } from '@/config';
// @ts-ignore:next-line
export const artemis = new Artemis({host: ENV.host , whitelist:[]});

export const useWalletInit = (): void => {
    const dispatch = useAppDispatch();
    const tknList = tokenList("obj");
    const connectObj = { host: ENV.host, whitelist: [...Object.values(ENV.canistersPrincipalIDs), ...Object.keys(tknList)] };
    useEffect(() => {
      const initAdapter = async (): Promise<void> => {
        const walletId: string = localStorage.getItem('dfinityWallet') || '';
        if (walletId) {
          dispatch(walletActions.setWalletSelected(walletId));
          dispatch(walletActions.setOnwalletList(walletState.Connecting));
        }
        const walletStatus = await artemis.autoConnect(connectObj);
        if (walletStatus && artemis?.principalId && artemis?.provider) {
          dispatch(walletActions.setWalletLoaded({
            principleId: artemis.principalId,
            accountId: artemis.accountId,
            walletActive: artemis.walletActive
          }));
        } else {
          dispatch(walletActions.setOnwalletList(walletState.Idle));
        }
      };
  
      initAdapter();
    }, []);
  };