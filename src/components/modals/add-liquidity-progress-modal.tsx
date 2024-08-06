import { checkPlainSrc, depositSrc, dropSrc, plusSrc } from '@/assets';
import {
  AddLiquidityModalData,
  AddLiquidityModalDataStep,
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

export const AddLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const { isAddLiquidityProgressModalOpened, addLiquidityModalData } =
    useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    // step: activeStep,
    batchTrx,
    fromValue,
    toValue,
  } = addLiquidityModalData;

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<AddLiquidityModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearDepositModalData());
    dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearDepositModalData());
      addNotification({
        title: `Added LP of ${fromValue} ${token0Symbol} + ${toValue} ${token1Symbol}`,
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
      isOpen={isAddLiquidityProgressModalOpened}
      isCentered
      title="Add LP in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          {steps?.includes(AddLiquidityModalDataStep.Getacnt) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Getacnt)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Getting Sonic <br /> Account
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.CreatePair) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.CreatePair)}
              iconSrc={plusSrc}
              chevron
            >
              Creating pair <br /> {token0Symbol} - {token1Symbol}
            </TransactionStep>
          )}

          {steps?.includes(AddLiquidityModalDataStep.Approve0) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Approve0)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Deposit0) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Deposit0)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Approve1) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Approve1)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> {token1Symbol}
            </TransactionStep>
          )}
          {steps?.includes(AddLiquidityModalDataStep.Deposit1) && (
            <TransactionStep
              status={getStepStatus(AddLiquidityModalDataStep.Deposit1)}
              iconSrc={depositSrc}
              chevron
            >
              Depositing <br /> {token1Symbol}
            </TransactionStep>
          )}

          <TransactionStep
            status={getStepStatus(AddLiquidityModalDataStep.AddLiquidity)}
            iconSrc={dropSrc}
          >
            Adding LP of <br /> {token0Symbol} + {token1Symbol}
          </TransactionStep>
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Adding Liquidity failed</Text>
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
