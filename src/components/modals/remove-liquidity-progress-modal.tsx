import { dropSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  NotificationType,
  RemoveLiquidityModalData,
  RemoveLiquidityModalDataStep,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const RemoveLiquidityProgressModal = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const { isRemoveLiquidityProgressModalOpened, removeLiquidityModalData } =
    useModalsStore();
  const {
    steps,
    token1Symbol,
    token0Symbol,
    // step: activeStep,
    fromValue,
    toValue,
    batchTrx,
  } = removeLiquidityModalData;
  const activeStep = batchTrx?.activeStep;
  const getStepStatus = useStepStatus<RemoveLiquidityModalData['step']>({
    activeStep,
    steps,
  });

  const handleClose = () => {
    dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
    dispatch(modalsSliceActions.closeRemoveLiquidityProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearRemoveLiquidityModalData());
      addNotification({
        title: `Removed LP of ${fromValue} ${token0Symbol} + ${toValue} ${token1Symbol}`,
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
      isOpen={isRemoveLiquidityProgressModalOpened}
      isCentered
      title="Removing LP in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          <TransactionStep
            status={getStepStatus(RemoveLiquidityModalDataStep.RemoveLiquidity)}
            iconSrc={dropSrc}
            chevron={
              steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) ||
              steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)
            }
          >
            Removing Liquidity Position of <br /> {token0Symbol} +{' '}
            {token1Symbol}
          </TransactionStep>

          {steps?.includes(RemoveLiquidityModalDataStep.Withdraw0) && (
            <TransactionStep
              status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw0)}
              iconSrc={withdrawSrc}
              chevron={steps?.includes(RemoveLiquidityModalDataStep.Withdraw1)}
            >
              Withdrawing <br /> {token0Symbol}
            </TransactionStep>
          )}
          {steps?.includes(RemoveLiquidityModalDataStep.Withdraw1) && (
            <TransactionStep
              status={getStepStatus(RemoveLiquidityModalDataStep.Withdraw1)}
              iconSrc={withdrawSrc}
            >
              Withdrawing <br /> {token1Symbol}
            </TransactionStep>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="center" mt={8} gap={6}>
          {batchTrx?.state === 'error' && (
            <>
              <Text>Removing liquidity</Text>
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
