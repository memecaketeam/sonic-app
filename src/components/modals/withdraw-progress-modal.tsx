import { withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
  WithdrawModalData,
  WithdrawModalDataStep,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const WithdrawProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const { isWithdrawProgressModalOpened, withdrawModalData } = useModalsStore();
  const { tokenSymbol, steps, batchTrx, withdrawAmount } = withdrawModalData;
  const [isRetrying, setIsRetrying] = useState(false);

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<WithdrawModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearWithdrawModalData());
    dispatch(modalsSliceActions.closeWithdrawProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearWithdrawModalData());
      addNotification({
        title: `Withdrawn ${withdrawAmount} ${tokenSymbol}`,
        type: NotificationType.Success,
        id: Date.now().toString(),
        transactionLink: '/activity',
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
      title="Withdraw in progress"
      onClose={handleClose}
      isOpen={isWithdrawProgressModalOpened}
      isCentered
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          <TransactionStep
            status={getStepStatus(WithdrawModalDataStep.Withdraw)}
            iconSrc={withdrawSrc}
          >
            Withdrawing <br /> {tokenSymbol}
          </TransactionStep>
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Withdrawing failed</Text>
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
