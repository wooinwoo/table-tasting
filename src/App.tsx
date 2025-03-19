import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Badge,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { TanStackTable } from "./components/tables/TanStackTable";
import { sampleData } from "./data/sampleData";
import { MUIDataGrid } from "./components/tables/MUIDataGrid";
import { AGGridTable } from "./components/tables/AGGridTable";
import { InovuaDataGrid } from "./components/tables/ReactDataGrid";
import { SemanticTable } from "./components/tables/SemanticTable";
import { ChakraTable } from "./components/tables/ChakraTable";
import { AntTable } from "./components/tables/AntTable";
import { BootstrapTable } from "./components/tables/BootstrapTable";
import { Shadows, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MantineTable } from "./components/tables/MantineTable";
import { ReactTableMaterial } from "./components/tables/ReactTableMaterial";
import { GridjsTable } from "./components/tables/GridjsTable";
import { TabularTable } from "./components/tables/TabularTable";
import { MantineProvider } from "@mantine/core";

const libraries = [
  {
    name: "TanStack Table (React Table v8)",
    description:
      "강력한 Headless UI 테이블 라이브러리로, 완벽한 커스터마이징이 가능합니다.",
    route: "/tanstack",
  },
  {
    name: "Material UI Data Grid",
    description:
      "Material Design 기반의 풍부한 기능을 가진 데이터 그리드 컴포넌트입니다.",
    route: "/mui",
  },
  {
    name: "AG Grid Enterprise",
    description:
      "엔터프라이즈급 고성능 테이블 라이브러리로, 다양한 기능을 제공합니다.",
    route: "/ag-grid",
  },
  {
    name: "React Data Grid (Adazzle)",
    description: "Excel과 유사한 스프레드시트 스타일의 그리드 컴포넌트입니다.",
    route: "/react-data-grid",
  },
  {
    name: "React Table Semantic UI",
    description:
      "Semantic UI 디자인 시스템을 따르는 심플하고 깔끔한 테이블입니다.",
    route: "/semantic",
  },
  {
    name: "Chakra UI Table",
    description:
      "접근성과 사용성을 고려한 모던한 디자인의 테이블 컴포넌트입니다.",
    route: "/chakra",
  },
  {
    name: "Ant Design Table",
    description: "기업용 애플리케이션에 최적화된 풍부한 기능의 테이블입니다.",
    route: "/antd",
  },
  {
    name: "React Bootstrap Table",
    description: "Bootstrap 스타일의 반응형 테이블 컴포넌트입니다.",
    route: "/bootstrap",
  },
  {
    name: "Mantine Table",
    description:
      "모던하고 커스터마이징이 자유로운 Mantine UI 기반의 테이블입니다.",
    route: "/mantine",
  },
  {
    name: "React Table + Material-UI",
    description:
      "TanStack Table과 Material-UI가 결합된 강력한 테이블 컴포넌트입니다.",
    route: "/react-table-mui",
  },
  {
    name: "Grid.js React",
    description: "가볍고 빠른 오픈소스 테이블 라이브러리입니다.",
    route: "/gridjs",
  },
  {
    name: "Tabulator React",
    description:
      "인터랙티브한 테이블 기능을 제공하는 강력한 데이터 그리드입니다.",
    route: "/tabulator",
  },
];

// MUI의 기본 shadows 배열
const shadows = [
  "none",
  "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
  "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
  "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
  "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
  "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
  "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
  "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
  "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
  "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
  "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
  "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
  "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
  "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
  "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
  "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
  "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
];

const mantineTheme = {
  colorScheme: "light",
  primaryColor: "blue",
  defaultRadius: "md",
};

// MUI 테마 설정을 더 자세히 정의
const muiTheme = createTheme({
  shadows: shadows as Shadows,
  typography: {
    fontFamily: "system-ui, sans-serif",
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
    },
    // 다른 typography 변형들 추가
    h1: { fontSize: "2.5rem" },
    h2: { fontSize: "2rem" },
    h3: { fontSize: "1.75rem" },
    h4: { fontSize: "1.5rem" },
    h5: { fontSize: "1.25rem" },
    h6: { fontSize: "1rem" },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        rowsPerPageOptions: [5, 10, 25],
        component: "div",
      },
      styleOverrides: {
        root: {
          overflow: "visible",
        },
        toolbar: {
          minHeight: "52px",
          alignItems: "center",
        },
        selectLabel: {
          margin: 0,
        },
        displayedRows: {
          margin: 0,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.87)",
          padding: "8px 16px",
          fontSize: "0.875rem",
        },
      },
    },
  },
});

// Chakra UI 테마 설정 수정
const chakraTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxW: "7xl",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "bold",
      },
    },
  },
});

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    const index = libraries.findIndex((lib) => lib.route === path);
    if (index !== -1) {
      setCurrentIndex(index);
    } else if (path !== "/") {
      navigate("/tanstack");
    }
  }, [location, navigate]);

  const nextTable = () => {
    const nextIndex = (currentIndex + 1) % libraries.length;
    navigate(libraries[nextIndex].route);
  };

  const prevTable = () => {
    const prevIndex = (currentIndex - 1 + libraries.length) % libraries.length;
    navigate(libraries[prevIndex].route);
  };

  const TableComponent = () => {
    switch (currentIndex) {
      case 0:
        return <TanStackTable data={sampleData} />;
      case 1:
        return <MUIDataGrid data={sampleData} />;
      case 2:
        return <AGGridTable data={sampleData} />;
      case 3:
        return <InovuaDataGrid data={sampleData} />;
      case 4:
        return <SemanticTable data={sampleData} />;
      case 5:
        return (
          <ChakraProvider theme={chakraTheme}>
            <ChakraTable data={sampleData} />
          </ChakraProvider>
        );
      case 6:
        return <AntTable data={sampleData} />;
      case 7:
        return <BootstrapTable data={sampleData} />;
      case 8:
        return (
          <MantineProvider theme={mantineTheme}>
            <MantineTable data={sampleData} />
          </MantineProvider>
        );
      case 9:
        return <ReactTableMaterial data={sampleData} />;
      case 10:
        return <GridjsTable data={sampleData} />;
      case 11:
        return <TabularTable data={sampleData} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box minH="100vh" bg="gray.50" display="flex" justifyContent="center">
        <Container
          maxW="container.xl"
          py={6}
          h="100vh"
          w="100%"
          display="flex"
          flexDirection="column"
        >
          <Stack spacing={6} h="full" align="center">
            <Heading
              as="h1"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, blue.500, blue.300)"
              bgClip="text"
              fontSize={["3xl", "4xl"]}
            >
              테이블 라이브러리 오마카세
            </Heading>

            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="xl"
              overflow="hidden"
              position="relative"
              w="full"
              minH="600px"
              flex="1"
              display="flex"
              flexDirection="column"
            >
              <Box position="absolute" top={4} right={4} zIndex={1}>
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  boxShadow="sm"
                >
                  {currentIndex + 1} / {libraries.length}
                </Badge>
              </Box>

              <Stack spacing={4} p={6} flex="0 0 auto">
                <Stack spacing={2} textAlign="center">
                  <Heading as="h2" size="lg" color="gray.800">
                    {libraries[currentIndex].name}
                  </Heading>
                  <Text color="gray.600" fontSize="lg">
                    {libraries[currentIndex].description}
                  </Text>
                </Stack>
              </Stack>

              <Box
                flex="1"
                overflow="auto"
                px={6}
                pb={6}
                position="relative"
                sx={{
                  "& > *": {
                    // 모든 테이블 컴포넌트에 적용
                    position: "absolute !important",
                    top: "0 !important",
                    left: "0 !important",
                    right: "0 !important",
                    bottom: "0 !important",
                    height: "100% !important",
                    width: "100% !important",
                  },
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "gray.50",
                    borderRadius: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "gray.300",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "gray.400",
                    },
                  },
                }}
              >
                <TableComponent />
              </Box>
            </Box>

            <Flex justify="center" gap={6} py={4}>
              <Button
                leftIcon={<ChevronLeftIcon boxSize={5} />}
                onClick={prevTable}
                isDisabled={currentIndex === 0}
                colorScheme="blue"
                size="lg"
                px={8}
                _hover={{
                  transform: "translateX(-4px)",
                }}
                transition="all 0.2s"
              >
                이전 테이블
              </Button>
              <Button
                rightIcon={<ChevronRightIcon boxSize={5} />}
                onClick={nextTable}
                isDisabled={currentIndex === libraries.length - 1}
                colorScheme="blue"
                size="lg"
                px={8}
                _hover={{
                  transform: "translateX(4px)",
                }}
                transition="all 0.2s"
              >
                다음 테이블
              </Button>
            </Flex>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
