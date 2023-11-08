import { ChakraTheme, ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'bodyBackground',
      },
    },
  },
  colors: {
    bodyBackground: '#23282E',
  },
}) as ChakraTheme;

export { theme };
