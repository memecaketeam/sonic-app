import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  modalsSliceActions,
  SwapModalData,
  SwapModalDataStep,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const SwapProgressModal = () => {
  const dispatch = useAppDispatch();
  const { isSwapProgressModalOpened, swapModalData } = useModalsStore();
  const {
    steps,
    fromTokenSymbol,
    toTokenSymbol,
    // step: activeStep,
    batchTrx,
  } = swapModalData;

  const activeStep = batchTrx?.activeStep;

  // console.log('swapModalData', steps, activeStep);

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

  console.log('modal', batchTrx);

  return (
    <TransactionProgressModal
      onClose={handleClose}
      isOpen={isSwapProgressModalOpened}
      isCentered
      title="Swap in progress"
    >
      <Box>
        <Flex>
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
          {batchTrx?.state === 'error' &&
            batchTrx?.FailedSteps?.includes(batchTrx?.activeStep) && (
              <>
                <Text>Swap failed during {batchTrx?.FailedSteps?.[0]}</Text>
                <Flex gap={8}>
                  <Button
                    colorScheme={'green'}
                    variant={'gradient'}
                    onClick={() => batchTrx.retryExecute()}
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
