import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { NextUIProvider } from "@nextui-org/react";

const App = ({ Component, pageProps }) => {
  return (
    <NextUIProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </NextUIProvider>
  );
};

export default App;
