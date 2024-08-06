import { swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
  WithdrawWICPModalData,
  WithdrawWICPModalDataStep,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const WithdrawWICPProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const { isWithdrawWICPProgressModalOpened, withdrawWICPModalData } =
    useModalsStore();
  const { steps, batchTrx } = withdrawWICPModalData;
  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<WithdrawWICPModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearWithdrawWICPModalData());
    dispatch(modalsSliceActions.closeWithdrawWICPProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearWithdrawWICPModalData());
      addNotification({
        title: `Unwrapping complete`,
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
      onClose={handleClose}
      isOpen={isWithdrawWICPProgressModalOpened}
      isCentered
      title="WICP unwrapping in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          {steps?.includes(WithdrawWICPModalDataStep.Withdraw) && (
            <TransactionStep
              status={getStepStatus(WithdrawWICPModalDataStep.Withdraw)}
              iconSrc={withdrawSrc}
              chevron
            >
              Withdrawing <br /> WICP
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(WithdrawWICPModalDataStep.WithdrawWICP)}
            iconSrc={swapSrc}
          >
            Unwrapping <br /> WICP
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
