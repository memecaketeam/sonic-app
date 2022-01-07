import {
  Box,
  HStack,
  Image,
  // AlertDescription,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaMinus } from '@react-icons/all-files/fa/FaMinus';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { infoSrc } from '@/assets';
import {
  Asset,
  AssetIconButton,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayValue,
  Header,
  InformationBox,
  PlugNotConnected,
  TokenBalancesPopover,
} from '@/components';
import { getAppAssetsSources } from '@/config/utils';
import { useBalances } from '@/hooks/use-balances';
import {
  assetsViewActions,
  FeatureState,
  useAppDispatch,
  useAssetsViewStore,
  usePlugStore,
  useSwapCanisterStore,
} from '@/store';
import { theme } from '@/theme';

export const AssetsListView = () => {
  const dispatch = useAppDispatch();
  const { isBannerOpened } = useAssetsViewStore();
  const { totalBalances, sonicBalances, tokenBalances } = useBalances();
  const { supportedTokenListState, balancesState, supportedTokenList } =
    useSwapCanisterStore();
  const { isConnected } = usePlugStore();

  const navigate = useNavigate();

  const navigateToDeposit = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/deposit?tokenId=${tokenId}`);
    }
  };

  const navigateToWithdraw = (tokenId?: string) => {
    if (tokenId) {
      navigate(`/assets/withdraw?tokenId=${tokenId}`);
    }
  };

  const handleBannerClose = () => {
    dispatch(assetsViewActions.setIsBannerOpened(false));
  };

  const notEmptyTokenList = useMemo(() => {
    if (supportedTokenList && totalBalances) {
      return supportedTokenList.filter(
        (token) => totalBalances[token.id] !== 0
      );
    }

    return [];
  }, [supportedTokenList, totalBalances]);

  const isTokenListPresent = useMemo(
    () => notEmptyTokenList && notEmptyTokenList.length > 0,
    [notEmptyTokenList]
  );

  const isLoading = useMemo(
    () =>
      supportedTokenListState === FeatureState.Loading ||
      balancesState === FeatureState.Loading,
    [supportedTokenListState, balancesState]
  );

  const isRefreshing = useMemo(
    () =>
      supportedTokenListState === FeatureState.Refreshing ||
      balancesState === FeatureState.Refreshing,
    [supportedTokenListState, balancesState]
  );

  return (
    <>
      {isBannerOpened && (
        <InformationBox
          title="Assets Details"
          mb={9}
          onClose={handleBannerClose}
        >
          <Text color="#888E8F">
            View all the assets you have deposited or obtained on Sonic through
            our Liquidity and Swaps protocols, and deposit more or withdraw them
            to your wallet.
          </Text>
        </InformationBox>
      )}

      <Header title="Your Assets" isRefreshing={isRefreshing} />

      {!isConnected ? (
        <PlugNotConnected message="Your assets will appear here." />
      ) : (
        <Box
          overflow="hidden"
          height="100%"
          display="flex"
          flexDirection="column"
          position="relative"
          _after={{
            content: "''",
            position: 'absolute',
            pointerEvents: 'none',
            height: 20,
            left: 0,
            right: 0,
            bottom: -1,
            background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`,
          }}
        >
          <Stack
            css={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            spacing={4}
            pb={8}
            overflow="auto"
            height="100%"
          >
            {isLoading ? (
              <>
                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>

                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>
              </>
            ) : isTokenListPresent ? (
              notEmptyTokenList?.map(
                ({ id, name, symbol, decimals, price, logo }) => (
                  <Asset key={id} imageSources={[logo]}>
                    <HStack spacing={4}>
                      <AssetImageBlock />
                      <AssetTitleBlock title={symbol} subtitle={name} />
                    </HStack>

                    <TokenBalancesPopover
                      sources={getAppAssetsSources({
                        balances: {
                          plug: tokenBalances?.[id],
                          sonic: sonicBalances?.[id],
                        },
                      })}
                      decimals={decimals}
                      symbol={symbol}
                    >
                      <Box>
                        <Text
                          fontWeight="bold"
                          color="gray.400"
                          display="flex"
                          alignItems="center"
                        >
                          Amount
                          <Image
                            src={infoSrc}
                            w={4}
                            h={4}
                            ml={1.5}
                            opacity={0.45}
                          />
                        </Text>
                        <DisplayValue
                          value={totalBalances?.[id]}
                          decimals={decimals}
                          fontWeight="bold"
                          disableTooltip
                        />
                      </Box>
                    </TokenBalancesPopover>
                    <Box>
                      <Text fontWeight="bold" color="gray.400">
                        Price
                      </Text>
                      <DisplayValue
                        fontWeight="bold"
                        prefix="$"
                        value={price ?? 0}
                      />
                    </Box>

                    <HStack>
                      <AssetIconButton
                        aria-label={`Withdraw ${symbol}`}
                        icon={<FaMinus />}
                        onClick={() => navigateToWithdraw(id)}
                      />
                      <AssetIconButton
                        colorScheme="dark-blue"
                        aria-label={`Deposit ${symbol}`}
                        icon={<FaPlus />}
                        onClick={() => navigateToDeposit(id)}
                      />
                    </HStack>
                  </Asset>
                )
              )
            ) : (
              <Text textAlign="center" color="gray.400">
                No assets available
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </>
  );
};
