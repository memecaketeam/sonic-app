import { checkPlainSrc, depositSrc, swapSrc, withdrawSrc } from '@/assets';
import {
  addNotification,
  MintModalData,
  MintModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useStepStatus } from '.';
import { TransactionProgressModal, TransactionStep } from './components';

export const MintXTCProgressModal = () => {
  const dispatch = useAppDispatch();
  const [isRetrying, setIsRetrying] = useState(false);
  const { isMintXTCProgressModalOpened, mintXTCModalData } = useModalsStore();
  const { steps, batchTrx, tokenSymbol, amount } = mintXTCModalData;

  const activeStep = batchTrx?.activeStep;

  const getStepStatus = useStepStatus<MintModalData['step']>({
    activeStep,
    steps,
  });
  const handleClose = () => {
    dispatch(modalsSliceActions.closeMintXTCProgressModal());
  };

  const handleCancel = () => {
    dispatch(modalsSliceActions.clearMintXTCModalData());
    dispatch(modalsSliceActions.closeMintXTCProgressModal());
  };

  useEffect(() => {
    if (batchTrx?.state === 'done') {
      handleClose();
      dispatch(modalsSliceActions.clearMintXTCModalData());
      addNotification({
        title: `Unwrap ${amount} ${tokenSymbol} failed`,
        type: NotificationType.Error,
        id: Date.now().toString(),
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
      isOpen={isMintXTCProgressModalOpened}
      isCentered
      title="Mint XTC in progress"
    >
      <Box w="100%">
        <Flex alignItems="center" justifyContent="center">
          <TransactionStep
            status={getStepStatus(MintModalDataStep.LedgerTransfer)}
            iconSrc={withdrawSrc}
            chevron
          >
            Ledger Transfer <br /> ICP
          </TransactionStep>
          <TransactionStep
            status={getStepStatus(MintModalDataStep.Mint)}
            iconSrc={swapSrc}
            chevron={
              steps?.includes(MintModalDataStep.Approve) ||
              steps?.includes(MintModalDataStep.Deposit)
            }
          >
            Minting <br /> XTC
          </TransactionStep>
          {steps?.includes(MintModalDataStep.Approve) && (
            <TransactionStep
              status={getStepStatus(MintModalDataStep.Approve)}
              iconSrc={checkPlainSrc}
              chevron
            >
              Approving <br /> XTC
            </TransactionStep>
          )}
          {steps?.includes(MintModalDataStep.Deposit) && (
            <TransactionStep
              status={getStepStatus(MintModalDataStep.Deposit)}
              iconSrc={depositSrc}
            >
              Depositing <br /> XTC
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
