import { useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  Stack,
  ButtonGroup,
  Button,
  Flex,
  Text,
  IconButton,
  Checkbox,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Person } from "../../data/sampleData";

interface Props {
  data: Person[];
}

interface SortConfig {
  key: keyof Person | null;
  direction: "asc" | "desc";
}

export function ChakraTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 색상 설정 더 강화
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const headerBg = useColorModeValue("blue.50", "gray.700");
  const inputBg = useColorModeValue("white", "whiteAlpha.100");

  // 정렬 처리
  const handleSort = (key: keyof Person) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // 필터링과 정렬이 적용된 데이터
  const filteredAndSortedData = useMemo(() => {
    let processed = [...data];

    // 검색어 필터링
    if (searchTerm) {
      processed = processed.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터링
    if (statusFilter) {
      processed = processed.filter((person) => person.status === statusFilter);
    }

    // 정렬
    if (sortConfig.key) {
      processed.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return processed;
  }, [data, searchTerm, statusFilter, sortConfig]);

  // 페이지네이션
  const pageCount = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 체크박스 처리
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((person) => person.id)));
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Box
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        bg={bgColor}
        boxShadow="lg"
        borderColor={borderColor}
      >
        <Stack
          p={6}
          spacing={4}
          borderBottomWidth="1px"
          borderColor={borderColor}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Flex justify="space-between" align="center" gap={4}>
            <Stack direction={["column", "row"]} spacing={4} flex={1}>
              <Input
                placeholder="이름, 직책, 부서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width={["full", "300px"]}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: "blue.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
                size="lg"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="상태 필터"
                width={["full", "200px"]}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: "blue.400" }}
                size="lg"
              >
                <option value="active">재직중</option>
                <option value="vacation">휴가중</option>
                <option value="resigned">퇴사</option>
              </Select>
            </Stack>
            <Select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              width={["full", "100px"]}
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: "blue.400" }}
              size="lg"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
            </Select>
          </Flex>
        </Stack>

        <Box overflowX="auto">
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th px={6} py={4} bg={headerBg}>
                  <Checkbox
                    isChecked={
                      paginatedData.length > 0 &&
                      paginatedData.every((person) =>
                        selectedRows.has(person.id)
                      )
                    }
                    onChange={handleSelectAll}
                    colorScheme="blue"
                    size="lg"
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("name")}
                  position="relative"
                  bg={headerBg}
                  px={6}
                  py={4}
                  _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
                >
                  <Flex align="center" justify="space-between">
                    <Text>이름</Text>
                    {sortConfig.key === "name" && (
                      <IconButton
                        aria-label="Sort"
                        icon={
                          sortConfig.direction === "asc" ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("role")}
                  bg={headerBg}
                  px={6}
                  py={4}
                  _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
                >
                  <Flex align="center" justify="space-between">
                    <Text>직책</Text>
                    {sortConfig.key === "role" && (
                      <IconButton
                        aria-label="Sort"
                        icon={
                          sortConfig.direction === "asc" ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("department")}
                  bg={headerBg}
                  px={6}
                  py={4}
                  _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
                >
                  <Flex align="center" justify="space-between">
                    <Text>부서</Text>
                    {sortConfig.key === "department" && (
                      <IconButton
                        aria-label="Sort"
                        icon={
                          sortConfig.direction === "asc" ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleSort("age")}
                  bg={headerBg}
                  px={6}
                  py={4}
                  _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
                >
                  <Flex align="center" justify="space-between">
                    <Text>나이</Text>
                    {sortConfig.key === "age" && (
                      <IconButton
                        aria-label="Sort"
                        icon={
                          sortConfig.direction === "asc" ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleSort("salary")}
                  bg={headerBg}
                  px={6}
                  py={4}
                  _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
                >
                  <Flex align="center" justify="space-between">
                    <Text>연봉</Text>
                    {sortConfig.key === "salary" && (
                      <IconButton
                        aria-label="Sort"
                        icon={
                          sortConfig.direction === "asc" ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Th>
                <Th bg={headerBg} px={6} py={4}>
                  <Text>상태</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((person) => (
                <Tr
                  key={person.id}
                  _hover={{ bg: hoverBg }}
                  bg={selectedRows.has(person.id) ? hoverBg : undefined}
                >
                  <Td px={6} py={4}>
                    <Checkbox
                      isChecked={selectedRows.has(person.id)}
                      onChange={() => handleSelectRow(person.id)}
                      colorScheme="blue"
                      size="lg"
                    />
                  </Td>
                  <Td px={6} py={4}>
                    {person.name}
                  </Td>
                  <Td px={6} py={4}>
                    {person.role}
                  </Td>
                  <Td px={6} py={4}>
                    {person.department}
                  </Td>
                  <Td px={6} py={4} isNumeric>
                    {person.age}
                  </Td>
                  <Td px={6} py={4} isNumeric>
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                      maximumFractionDigits: 0,
                    }).format(person.salary)}
                  </Td>
                  <Td px={6} py={4}>
                    <Badge
                      colorScheme={
                        person.status === "active"
                          ? "green"
                          : person.status === "vacation"
                          ? "orange"
                          : "red"
                      }
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {person.status === "active"
                        ? "재직중"
                        : person.status === "vacation"
                        ? "휴가중"
                        : "퇴사"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Flex
          justify="space-between"
          align="center"
          p={6}
          borderTopWidth="1px"
          borderColor={borderColor}
          bg={useColorModeValue("gray.50", "gray.800")}
          direction={["column", "row"]}
          gap={4}
        >
          <Text color={textColor} fontSize="md" fontWeight="medium">
            총 {filteredAndSortedData.length}개 중{" "}
            <Text as="span" color="blue.500" fontWeight="bold">
              {selectedRows.size}
            </Text>
            개 선택됨
          </Text>
          <ButtonGroup spacing={2}>
            <Button
              onClick={() => setCurrentPage(1)}
              isDisabled={currentPage === 1}
              colorScheme="blue"
              size="md"
              variant="outline"
            >
              처음
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              colorScheme="blue"
              size="md"
            >
              이전
            </Button>
            <Button variant="ghost" size="md" isDisabled>
              {currentPage} / {pageCount}
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === pageCount}
              colorScheme="blue"
              size="md"
            >
              다음
            </Button>
            <Button
              onClick={() => setCurrentPage(pageCount)}
              isDisabled={currentPage === pageCount}
              colorScheme="blue"
              size="md"
              variant="outline"
            >
              마지막
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Container>
  );
}
