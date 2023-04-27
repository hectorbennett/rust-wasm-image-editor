import Head from "next/head";
import { MantineProvider, ColorScheme, ColorSchemeProvider } from "@mantine/core";

import "../styles.css";
import { SpotlightProvider } from "@mantine/spotlight";
import { CustomSpotlightAction } from "src/components/CustomSpotlightAction";

export default function App({ Component, pageProps }) {
  const toggleColorScheme = () => {};

  const colorScheme = "dark";

  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <SpotlightProvider
            shortcut={null}
            actions={[]}
            actionComponent={CustomSpotlightAction}
            overlayProps={{ blur: 0 }}
            transitionProps={{ duration: 0 }}
          >
            <Component {...pageProps} />
          </SpotlightProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
