import { useTotalBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';

import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

export interface SwapLinkProps {
  id: string;
}

export const SwapLink: React.FC<SwapLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useTotalBalances();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { from, to, slippage, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, to, slippage, keepInSonic }));
  }, []);

  const handleStateChange = () => {
    switch (swapBatch.state) {
      case 'approve':
      case 'deposit':
        dispatch(modalsSliceActions.setSwapData({ step: 'deposit' }));

        break;
      case 'swap':
        dispatch(modalsSliceActions.setSwapData({ step: 'swap' }));

        break;
      case 'withdraw':
        dispatch(modalsSliceActions.setSwapData({ step: 'withdraw' }));

        break;
    }
  };

  const handleOpenModal = () => {
    handleStateChange();
    openSwapModal();
    dispatch(modalsSliceActions.openSwapProgressModal());
  };

  const [swapBatch, openSwapModal] = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
  });

  useEffect(handleStateChange, [swapBatch.state]);

  useEffect(() => {
    swapBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        dispatch(modalsSliceActions.clearSwapData());

        addNotification({
          title: `Swapped ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
          type: NotificationType.Done,
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Swap Error', err);
        dispatch(modalsSliceActions.clearSwapData());

        addNotification({
          title: `Failed swapping ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));

    handleOpenModal();
  }, []);

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
