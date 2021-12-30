import { useMemo } from 'react';

import { ENV } from '@/config';
import { WICPIDL } from '@/did';

import { CreateTransaction, WithdrawWICP } from '../../models';

export const useWithdrawWICPTransactionMemo: CreateTransaction<WithdrawWICP> = (
  { amount, toAccountId },
  onSuccess,
  onFail
) =>
  useMemo(() => {
    if (!amount) throw new Error('Amount is required');
    if (!toAccountId) throw new Error('Account ID is required');

    return {
      canisterId: ENV.canisterIds.WICP,
      idl: WICPIDL.factory,
      methodName: 'withdraw',
      onSuccess: async (res: WICPIDL.TxReceipt) => {
        if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [amount, toAccountId],
    };
  }, [amount, toAccountId]);
