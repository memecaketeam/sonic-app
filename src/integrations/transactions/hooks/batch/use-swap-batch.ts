import { useMemo } from 'react';

import {
  modalsSliceActions,
  SwapModalDataStep,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';
import { SwapModel } from '../..';

import {
  useApproveTransactionMemo,
  useDepositTransactionMemo,
  useSwapExactTokensTransactionMemo,
  useWithdrawTransactionMemo,
  intitICRCTokenDeposit,
  useICRCTransferMemo,
  useIcrc2Approve, // useICRCDepositMemo ,
} from '..';

import { getAmountDependsOnBalance } from './batch.utils';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export interface ExtraDepositSwapBatchOptions {
  keepInSonic: boolean;
}

export const useSwapBatch = ({
  keepInSonic,
  ...swapParams
}: SwapModel & ExtraDepositSwapBatchOptions) => {
  const dispatch = useAppDispatch();

  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) throw new Error('Sonic balance is required');
  if (!swapParams.from.metadata || !swapParams.to.metadata)
    throw new Error('Tokens are required');

  const depositParams = {
    token: swapParams.from.metadata,
    amount: getAmountDependsOnBalance(
      sonicBalances[swapParams.from.metadata.id],
      swapParams.from.metadata.decimals,
      swapParams.from.value
    ),
    allowance: swapParams.allowance,
    entryVal: '0',
  };
  const withdrawParams = {
    token: swapParams.to.metadata,
    amount: swapParams.to.value,
  };
  var tokenType = depositParams.token?.tokenType?.toLowerCase();

  var batchLoad: any = { state: 'idle' };
  var SwapBatch = { batch: batchLoad, openBatchModal: () => {} };
  var trxList: any = {};

  if (tokenType == 'dip20' || tokenType == 'yc') {
    const approve = useApproveTransactionMemo(depositParams);
    const deposit = useDepositTransactionMemo(depositParams);
    if (parseFloat(depositParams.amount) > 0)
      trxList = { approve: approve, deposit: deposit };
  } else if (tokenType == 'icrc1') {
    var getAcnt = intitICRCTokenDeposit();
    var approveTx = useICRCTransferMemo({ ...depositParams });
    var depositTx = useDepositTransactionMemo(depositParams);
    if (parseFloat(depositParams.amount) > 0)
      trxList = { getacnt: getAcnt, approve: approveTx, deposit: depositTx };
  } else if (tokenType == 'icrc2') {
    const approve = useIcrc2Approve(depositParams);
    const deposit = useDepositTransactionMemo(depositParams);
    if (parseFloat(depositParams.amount) > 0)
      trxList = { approve: approve, deposit: deposit };
  }

  swapParams.entryVal = depositParams.amount;
  const swap = useSwapExactTokensTransactionMemo(swapParams);

  trxList = { ...trxList, swap: swap };

  if (!keepInSonic) {
    trxList = {
      ...trxList,
      withdraw: useWithdrawTransactionMemo(withdrawParams),
    };
  }

  const SwapBatchTrx = useMemo(() => {
    return new BatchTransact(trxList, artemis);
  }, []);

  const openBatchModal = () => {
    dispatch(
      modalsSliceActions.setSwapModalData({
        steps: Object.keys(trxList) as SwapModalDataStep[],
        fromTokenSymbol: swapParams.from.metadata?.symbol,
        toTokenSymbol: swapParams.to.metadata?.symbol,
        batchTrx: SwapBatchTrx,
      })
    );
    dispatch(modalsSliceActions.openSwapProgressModal());
  };

  if (SwapBatchTrx) {
    batchLoad.batchExecute = SwapBatchTrx;
    batchLoad.batchFnUpdate = true;
  }
  SwapBatch = { batch: batchLoad, openBatchModal };
  return SwapBatch;
};
