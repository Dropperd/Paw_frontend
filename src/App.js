import React from "react";
import Router from "./router";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <Router />
      </MantineProvider>
    </>
  );
}

export default App;
