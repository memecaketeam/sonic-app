import { depositSrc } from '@/assets';
import {
  TransferModalData,
  TransferModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
  NotificationType,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const TransferProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();

  const { isTransferProgressModalOpened, transferModalData } = useModalsStore();
  const { steps, tokenSymbol, batchTrx, fromValue } = transferModalData;
  const [isRetrying, setIsRetrying] = useState(false);

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<TransferModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeTransferProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearTransferModalData());
    dispatch(modalsSliceActions.closeTransferProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearTransferModalData());
      addNotification({
        title: `Transfered ${fromValue} ${tokenSymbol}`,
        type: NotificationType.Success,
        id: Date.now().toString(),
        transactionLink: '',
      });
    }
  }, [batchTrx?.state]);

  const onClickRetry = () => {
    setIsRetrying(true);
    batchTrx.retryExecute();
    setTimeout(() => {
      setIsRetrying(false);
    }, 3000);
  };

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isTransferProgressModalOpened}
      isCentered
      title="Transfer in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          {steps?.includes(TransferModalDataStep.Transfer) && (
            <TransactionStep
              status={getStepStatus(TransferModalDataStep.Transfer)}
              iconSrc={depositSrc}
            >
              Transferring {tokenSymbol}
            </TransactionStep>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Transferring failed</Text>
              <Flex gap={8}>
                <Button
                  colorScheme={'green'}
                  variant={'gradient'}
                  onClick={onClickRetry}
                  isDisabled={isRetrying}
                >
                  Retry
                </Button>
                <Button
                  colorScheme={'green'}
                  variant={'outline'}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    </TransactionProgressModal>
  );
};

