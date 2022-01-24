import {
  chakra,
  Container,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Link as ChakraLink,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMoon } from '@react-icons/all-files/fa/FaMoon';
import { FaSun } from '@react-icons/all-files/fa/FaSun';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ENV } from '@/config';
import { usePlugStore } from '@/store';
import { theme } from '@/theme';

import { PlugButton } from '..';
import { LogoBox } from '../core';
import { PlugMenu } from '../plug/plug-menu';
import {
  FOOTER_HEIGHT,
  NAVBAR_HEIGHT,
  NAVIGATION_TABS,
} from './layout.constants';

export const Layout: React.FC = ({ children, ...props }) => {
  const { isConnected } = usePlugStore();
  const location = useLocation();

  const currentTabIndex = useMemo(
    () =>
      NAVIGATION_TABS.findIndex(({ url }) => location.pathname.includes(url)),
    [location]
  );

  const backgroundColor = useColorModeValue('dark-blue.50', 'black');

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Container maxW="container.xl" position="sticky" top={0} zIndex={10}>
        <Grid
          position="relative"
          zIndex={-2}
          as="header"
          py="8"
          templateColumns="repeat(5, 1fr)"
          gap="4"
          alignItems="center"
          backgroundColor={backgroundColor}
          transition="background 200ms"
          _after={{
            content: "''",
            position: 'absolute',
            pointerEvents: 'none',
            height: 10,
            left: 0,
            right: 0,
            bottom: -10,
            background: `linear-gradient(to bottom, ${theme.colors.bg} 0%, transparent 100%)`,
          }}
        >
          <GridItem
            as={HStack}
            spacing={4}
            colSpan={1}
            justifySelf="center"
            alignItems="center"
          >
            <LogoBox />
            <ChakraLink
              href={ENV.URLs.sonicDocs}
              target="_blank"
              rel="noopener noreferrer"
              fontWeight="bold"
            >
              Docs
            </ChakraLink>

            <ChakraLink
              href={`${ENV.URLs.sonicDocs}/dev/swaps-api`}
              target="_blank"
              rel="noopener noreferrer"
              fontWeight="bold"
            >
              API
            </ChakraLink>
          </GridItem>
          <GridItem colSpan={3} justifySelf="center">
            <chakra.nav>
              <Tabs
                index={currentTabIndex}
                variant="solid-rounded"
                colorScheme="dark-blue"
              >
                <TabList>
                  {NAVIGATION_TABS.map(({ label, url }) => (
                    <Tab
                      as={Link}
                      key={label}
                      isSelected={location.pathname === url}
                      to={url}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </chakra.nav>
          </GridItem>
          <GridItem colSpan={1} justifySelf="center">
            <HStack>
              {isConnected ? <PlugMenu /> : <PlugButton />}
              {ENV.isDarkModeEnabled && (
                <Tooltip
                  label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                  <IconButton
                    colorScheme={colorMode === 'dark' ? 'dark-blue' : 'yellow'}
                    variant="outline"
                    aria-label={
                      colorMode === 'dark' ? 'Light mode' : 'Dark mode'
                    }
                    icon={colorMode === 'dark' ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                  />
                </Tooltip>
              )}
            </HStack>
          </GridItem>
        </Grid>
      </Container>

      <Container
        as="main"
        maxW="xl"
        minH={`calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`}
        // maxH={`calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`}
        py="10"
        display="flex"
        flexDirection="column"
        {...props}
      >
        {children}
      </Container>

      <chakra.footer
        px="4"
        py="2"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        background={`linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`}
      >
        <Text>Sonic v1</Text>
      </chakra.footer>
    </>
  );
};
