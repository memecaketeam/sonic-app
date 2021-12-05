import { Text, Box, Image, Flex } from '@chakra-ui/react';

import { Checkbox, TitleBox, TokenBox, Button } from '@/components';
import { arrowDownSrc, infoSrc } from '@/assets';
import { useNotificationStore } from '@/store';

type ReviewStepProps = {
  fromValue: string;
  toValue: string;
  fromToken: any;
  toToken: any;
  keepInSonic: boolean;
  nextStep: () => any;
  prevStep: () => any;
  tokenOptions: object;
  setKeepInSonic: (shouldKeep: boolean) => any;
};

export const ReviewStep = ({
  fromValue,
  toValue,
  fromToken,
  toToken,
  nextStep,
  prevStep,
  keepInSonic,
  setKeepInSonic,
  tokenOptions,
}: ReviewStepProps) => {
  const { addNotification } = useNotificationStore();
  const handleApproveSwap = () => {
    // Integration: Do swap
    // trigger modals.
    addNotification({
      title: 'NOTIFICATION',
      type: 'done',
      id: Date.now().toString(),
    });
    nextStep();
  };

  return (
    <>
      <TitleBox title="Swap" settings="sd" onArrowBack={prevStep} />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={fromValue}
            setValue={() => {}}
            onTokenSelect={() => {}}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={fromToken}
            balance="0.00"
            amount="0.00"
            disabled
            menuDisabled
          />
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="#3D52F4"
          mt="-16px"
          mb="-26px"
          zIndex={1200}
        >
          <Image m="auto" src={arrowDownSrc} />
        </Box>
        <Box mt={2.5} width="100%">
          <TokenBox
            value={toValue}
            setValue={() => {}}
            onTokenSelect={() => {}}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={toToken}
            status="active"
            balance="0.00"
            amount="0.00"
            glow
            disabled
            menuDisabled
          />
        </Box>
      </Flex>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={5}
        mb={5}
        bg="#1E1E1E"
        px={5}
        py={4}
      >
        <Flex direction="row" alignItems="center">
          <Checkbox
            checked={keepInSonic}
            onClick={() => setKeepInSonic(!keepInSonic)}
          />
          <Text
            fontWeight={600}
            ml={2}
            transition="color 200ms"
            color={keepInSonic ? '#FFFFFF' : '#888E8F'}
          >
            Keep tokens in Sonic after swap
          </Text>
        </Flex>
        <Image
          src={infoSrc}
          width={5}
          transition="opacity 200ms"
          opacity={keepInSonic ? 1 : 0.5}
        />
      </Flex>
      <Button onClick={handleApproveSwap} fontSize="2xl" borderRadius={20}>
        Confirm Swap
      </Button>
    </>
  );
};
