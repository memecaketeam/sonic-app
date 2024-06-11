import { Button } from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { TransactionFailedModal } from './components';

export const RemoveLiquidityFailModal = () => {
  const { isRemoveLiquidityFailModalOpened, removeLiquidityModalData } =
    useModalsStore();
  const { callbacks: [retryCallback, closeCallback] = [] } =
    removeLiquidityModalData;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeRemoveLiquidityFailModal());
  };

  return (
    <TransactionFailedModal
      onClose={handleClose}
      isOpen={isRemoveLiquidityFailModalOpened}
      isCentered
      title="Remove Liquidity Failed"
    >
      <Button
        variant="gradient"
        colorScheme="green"
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={retryCallback}
        isFullWidth
      >
        Retry
      </Button>
      <Button
        borderRadius={12}
        fontWeight={700}
        fontSize="1.125rem"
        onClick={handleClose}
        isFullWidth
      >
        Close
      </Button>
    </TransactionFailedModal>
  );
};
