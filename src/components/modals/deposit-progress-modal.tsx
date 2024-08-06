import { checkPlainSrc, depositSrc } from '@/assets';
import {
  DepositModalData,
  DepositModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const DepositProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const { isDepositProgressModalOpened, depositModalData } = useModalsStore();
  const { steps, tokenSymbol, batchTrx, amount } = depositModalData;
  const [isRetrying, setIsRetrying] = useState(false);

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<DepositModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeDepositProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearDepositModalData());
    dispatch(modalsSliceActions.closeDepositProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearDepositModalData());
      addNotification({
        title: `Deposited ${amount} ${tokenSymbol}`,
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
      isOpen={isDepositProgressModalOpened}
      isCentered
      title="Deposit in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          {steps?.includes(DepositModalDataStep.Getacnt) && (
            <TransactionStep
              status={getStepStatus(DepositModalDataStep.Getacnt)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Getting Sonic {tokenSymbol} <br /> Account
            </TransactionStep>
          )}
          {steps?.includes(DepositModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(DepositModalDataStep.Approve)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> {tokenSymbol}
            </TransactionStep>
          )}
          <TransactionStep
            status={getStepStatus(DepositModalDataStep.Deposit)}
            iconSrc={depositSrc}
          >
            Depositing <br /> {tokenSymbol}
          </TransactionStep>
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Depositing failed</Text>
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
