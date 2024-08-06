import { useMemo } from 'react';

import {
  TransferModalDataStep,
  modalsSliceActions,
  useAppDispatch,
} from '@/store';

import { Transfer } from '../..';
import { useTransferTransactionMemo } from '..';

import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

export const useTransferBatch = (transfer: Transfer): any => {
  const dispatch = useAppDispatch();
  var batchLoad: any = { state: 'idle', batchExecute: {} };
  var TransferBatch = {
    batch: batchLoad,
    openBatchModal: () => {},
    transactions: {},
  };

  const transferTrx = useTransferTransactionMemo(transfer); //useTransferTransactionMemo(transfer);

  const TransferBatchTx = useMemo(() => {
    return new BatchTransact({ transfer: transferTrx }, artemis);
  }, [transferTrx]);

  var openBatchModal = () => {
    dispatch(
      modalsSliceActions.setTransferModalData({
        steps: ['transfer'] as TransferModalDataStep[],
        tokenSymbol: transfer.token?.symbol,
        fromValue: transfer.amount,
        batchTrx: TransferBatchTx,
      })
    );
    dispatch(modalsSliceActions.openTransferProgressModal());
  };

  if (TransferBatchTx) {
    batchLoad.batchExecute = TransferBatchTx;
    TransferBatch = { ...TransferBatch, batch: batchLoad, openBatchModal };
    return TransferBatch;
  } else return TransferBatch;
};

