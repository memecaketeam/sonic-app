import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  NotificationType,
  SwapModalData,
  SwapModalDataStep,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressModalOpened, swapModalData } = useModalsStore();
  const { addNotification } = useNotificationStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const {
    steps,
    fromTokenSymbol,
    toTokenSymbol,
    // step: activeStep,
    batchTrx,
    fromValue,
    toValue,
  } = swapModalData;

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<SwapModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeSwapProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearSwapModalData());
    dispatch(modalsSliceActions.closeSwapProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearSwapModalData());
      addNotification({
        title: `Swapped ${fromValue} ${fromTokenSymbol} for ${toValue} ${toTokenSymbol}`,
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
      isOpen={isSwapProgressModalOpened}
      isCentered
      title="Swap in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          {steps?.includes(SwapModalDataStep.Getacnt) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Getacnt)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Getting Sonic
              <br />
              {fromTokenSymbol} Account
            </TransactionStep>
          )}
          {steps?.includes(SwapModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Approve)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> {fromTokenSymbol}
            </TransactionStep>
          )}
          {steps?.includes(SwapModalDataStep.Deposit) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Deposit)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {fromTokenSymbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(SwapModalDataStep.Swap)}
            iconSrc={swapSrc}
            chevron={steps?.includes(SwapModalDataStep.Withdraw)}
          >
            Swapping <br /> {fromTokenSymbol} to {toTokenSymbol}
          </TransactionStep>
          {steps?.includes(SwapModalDataStep.Withdraw) && (
            <TransactionStep
              status={getStepStatus(SwapModalDataStep.Withdraw)}
              iconSrc={withdrawSrc}
            >
              Withdrawing <br /> {toTokenSymbol}
            </TransactionStep>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Swaping failed</Text>
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
