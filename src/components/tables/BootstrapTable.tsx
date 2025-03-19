import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  styled,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Person } from "../../data/sampleData";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: "#0d6efd",
    color: theme.palette.common.white,
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: "#0b5ed7",
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.075) !important",
  },
  "&.Mui-selected": {
    backgroundColor: `${theme.palette.action.selected} !important`,
  },
}));

interface Props {
  data: Person[];
}

type SortDirection = "asc" | "desc";
type SortKey = keyof Person;

export function BootstrapTable({ data }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "name",
    direction: "asc",
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSort = (key: SortKey) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredData.map((person) => person.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 새로고침 시뮬레이션
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["이름", "직책", "부서", "나이", "연봉", "상태"],
      ...filteredData.map((person) => [
        person.name,
        person.role,
        person.department,
        person.age.toString(),
        person.salary.toString(),
        person.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_data.csv";
    link.click();
  };

  const filteredData = useMemo(() => {
    return data
      .filter(
        (person) =>
          (statusFilter.length === 0 || statusFilter.includes(person.status)) &&
          Object.values(person).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const direction = sortConfig.direction === "asc" ? 1 : -1;
        return aValue > bValue ? direction : -direction;
      });
  }, [data, searchTerm, statusFilter, sortConfig]);

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>상태 필터</InputLabel>
          <Select
            multiple
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            label="상태 필터"
          >
            <MenuItem value="active">재직중</MenuItem>
            <MenuItem value="vacation">휴가중</MenuItem>
            <MenuItem value="resigned">퇴사</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="새로고침">
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="CSV 내보내기">
          <IconButton onClick={handleExport}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < filteredData.length
                  }
                  checked={selected.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </StyledTableCell>
              {["name", "role", "department", "age", "salary", "status"].map(
                (key) => (
                  <StyledTableCell
                    key={key}
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <TableSortLabel
                      active={sortConfig.key === key}
                      direction={
                        sortConfig.key === key ? sortConfig.direction : "asc"
                      }
                    >
                      {key === "name"
                        ? "이름"
                        : key === "role"
                        ? "직책"
                        : key === "department"
                        ? "부서"
                        : key === "age"
                        ? "나이"
                        : key === "salary"
                        ? "연봉"
                        : "상태"}
                    </TableSortLabel>
                  </StyledTableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((person) => (
              <StyledTableRow
                key={person.id}
                selected={selected.includes(person.id)}
                onClick={() => handleSelect(person.id)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(person.id)} />
                </TableCell>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>{person.department}</TableCell>
                <TableCell>{person.age}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                    maximumFractionDigits: 0,
                  }).format(person.salary)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      person.status === "active"
                        ? "재직중"
                        : person.status === "vacation"
                        ? "휴가중"
                        : "퇴사"
                    }
                    color={
                      person.status === "active"
                        ? "success"
                        : person.status === "vacation"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {selected.length}개 선택됨
        </Typography>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Paper>
  );
}
