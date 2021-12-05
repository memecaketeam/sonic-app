import { IconButton, HStack, Box, Image, Flex } from '@chakra-ui/react';
import { greyMinusSrc } from '@/assets';
import { PlusIcon } from '@/components/icons';

type AssetProps = {
  mainImgSrc?: string;
  secondImg?: string;
  title?: string;
  children: any;
  onIncrement: () => any;
  onDecreace: () => any;
};

export const Asset = ({
  mainImgSrc,
  secondImg,
  children,
  title,
  onIncrement,
  onDecreace,
}: AssetProps) => {
  const MainImg = <Image width="44px" height="44px" src={mainImgSrc} />;

  const SecondImg = (
    <Box width="44px" height="44px" position="relative">
      <Image
        position="absolute"
        width="30px"
        height="30px"
        top={0}
        left={0}
        src={mainImgSrc}
      />
      <Image
        position="absolute"
        width="30px"
        height="30px"
        bottom={0}
        right={0}
        src={secondImg}
      />
    </Box>
  );

  return (
    <Flex
      position="relative"
      direction="row"
      borderRadius="2xl"
      alignItems="center"
      justifyContent="space-between"
      bg="#1E1E1E"
      px={5}
      py={4}
    >
      <Flex direction="row" alignItems="center" justifyContent="flex-start">
        {secondImg ? SecondImg : MainImg}
        <Box ml={4} fontSize="lg" fontWeight={700} color="#F6FCFD" as="h3">
          {title}
        </Box>
      </Flex>
      {children}
      <HStack>
        <IconButton
          icon={<Image src={greyMinusSrc} />}
          aria-label="Left icon"
          isRound
          variant="outline"
        />
        <IconButton
          icon={<PlusIcon />}
          aria-label="Right icon"
          isRound
          variant="outline"
        />
      </HStack>
    </Flex>
  );
};
