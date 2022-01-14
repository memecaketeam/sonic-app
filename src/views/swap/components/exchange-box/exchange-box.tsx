import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';

import { infoSrc } from '@/assets';
import { StackLine } from '@/components';
import { ICP_METADATA } from '@/constants';
import { useSwapViewStore } from '@/store';
import {
  getAmountOutMin,
  getCurrencyString,
  getSwapAmountOut,
} from '@/utils/format';

export const ExchangeBox: React.FC = () => {
  const { from, to, slippage, baseTokenPaths } = useSwapViewStore();

  // FIXME: price impact
  const priceImpact = useMemo(() => {
    if (from.metadata && to.metadata && baseTokenPaths[to.metadata.id]) {
      const expectedValue = new BigNumber(from.value).multipliedBy(
        baseTokenPaths[to.metadata.id].amountOut
      );
      const realValue = new BigNumber(to.value);
      const percentage = realValue
        .dividedBy(expectedValue)
        .minus(1)
        .multipliedBy(100);
      return percentage.dp(3).toNumber();
    }
    return 0;
  }, [from, to, baseTokenPaths]);

  const { depositFee, withdrawFee } = useMemo(() => {
    if (from.metadata?.id && to.metadata?.id) {
      const depositFee = getCurrencyString(
        BigInt(2) * from.metadata.fee,
        from.metadata.decimals
      );

      const withdrawFee = getCurrencyString(
        to.metadata.fee,
        to.metadata.decimals
      );

      return { depositFee, withdrawFee };
    }

    return { depositFee: 0, withdrawFee: 0 };
  }, [from, to]);

  if (!from.metadata || !to.metadata) return null;

  const [icp, feeMessage] =
    from.metadata.id === ICP_METADATA.id
      ? [from.metadata, 'Wrap']
      : to.metadata.id === ICP_METADATA.id
      ? [to.metadata, 'Unwrap']
      : [];

  if (icp) {
    return (
      <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400}>
        <Text display="flex" alignItems="center">
          {from.metadata.symbol}&nbsp;
          <FaArrowRight />
          &nbsp;{to.metadata.symbol}
        </Text>
        <Text flex={1} textAlign="right">
          {feeMessage} Fee = {getCurrencyString(icp.fee, icp.decimals)}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400}>
      <Text display="flex" alignItems="center">
        {from.metadata.symbol}&nbsp;
        <FaArrowRight />
        &nbsp;{to.metadata.symbol}
      </Text>
      <Text flex={1} textAlign="right" mx={2}>
        1&nbsp;{from.metadata.symbol}&nbsp;=&nbsp;
        {getSwapAmountOut(
          { metadata: { ...from.metadata, paths: baseTokenPaths }, value: '1' },
          to
        )}
        &nbsp;
        {to.metadata.symbol}
      </Text>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Image
            alt="info"
            src={infoSrc}
            width={5}
            transition="opacity 200ms"
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent minWidth="400px">
            <PopoverHeader>Transaction Details</PopoverHeader>
            <PopoverArrow />
            <PopoverBody display="inline-block">
              <Stack>
                <StackLine
                  title="Minimum Received"
                  value={`${
                    to.value
                      ? getAmountOutMin(
                          to.value,
                          Number(slippage) / 100,
                          to.metadata.decimals,
                          [
                            {
                              fee: from.metadata.fee,
                              decimals: from.metadata.decimals,
                            },
                            {
                              fee: to.metadata.fee,
                              decimals: to.metadata.decimals,
                            },
                          ]
                        )
                      : 0
                  } ${to.metadata.symbol}`}
                />
                <StackLine title="Price Impact" value={`${priceImpact}%`} />
                <StackLine title="Allowed Slippage" value={`${slippage}%`} />
                {/* TODO: add liquidity fee */}
                {/* <StackLine
                  title="Liquidity Provider Fee"
                  value={`${10} ${to.metadata.symbol}`}
                /> */}
                <StackLine
                  title="Deposit Fee"
                  value={`${depositFee} ${from.metadata.symbol}`}
                />
                <StackLine
                  title="Withdraw Fee"
                  value={`${withdrawFee} ${to.metadata.symbol}`}
                />
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};
