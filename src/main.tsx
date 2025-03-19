import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.tsx";

// Chakra UI 테마 설정
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        bg: "gray.50",
      },
    },
  },
  fonts: {
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#2196F3",
      600: "#1E88E5",
      700: "#1976D2",
      800: "#1565C0",
      900: "#0D47A1",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
