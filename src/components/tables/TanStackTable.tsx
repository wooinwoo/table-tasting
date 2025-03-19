import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  flexRender,
  Table as TableInstance,
  Column,
} from "@tanstack/react-table";
import { useState } from "react";
import { Person } from "../../data/sampleData";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Box,
  Chip,
  styled,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor:
    status === "active"
      ? theme.palette.success.light
      : status === "vacation"
      ? theme.palette.warning.light
      : theme.palette.error.light,
  color: theme.palette.getContrastText(
    status === "active"
      ? theme.palette.success.light
      : status === "vacation"
      ? theme.palette.warning.light
      : theme.palette.error.light
  ),
}));

const columnHelper = createColumnHelper<Person>();

interface FilterComponentProps {
  column: Column<Person, unknown>;
  table: TableInstance<Person>;
}

const FilterComponent = ({ column, table }: FilterComponentProps) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <TextField
        type="number"
        size="small"
        placeholder={`Min ${column.id}`}
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
      />
      <TextField
        type="number"
        size="small"
        placeholder={`Max ${column.id}`}
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
      />
    </Box>
  ) : (
    <TextField
      type="text"
      size="small"
      placeholder={`Search ${column.id}...`}
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
    />
  );
};

const columns = [
  columnHelper.accessor("name", {
    header: "이름",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  }),
  columnHelper.accessor("role", {
    header: "직책",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  }),
  columnHelper.accessor("department", {
    header: "부서",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  }),
  columnHelper.accessor("age", {
    header: "나이",
    cell: (info) => `${info.getValue()}세`,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as number;
      const [min, max] = filterValue as [number, number];
      if (min !== undefined && max !== undefined) {
        return value >= min && value <= max;
      }
      if (min !== undefined) {
        return value >= min;
      }
      if (max !== undefined) {
        return value <= max;
      }
      return true;
    },
  }),
  columnHelper.accessor("salary", {
    header: "연봉",
    cell: (info) =>
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(info.getValue()),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as number;
      const [min, max] = filterValue as [number, number];
      if (min !== undefined && max !== undefined) {
        return value >= min && value <= max;
      }
      if (min !== undefined) {
        return value >= min;
      }
      if (max !== undefined) {
        return value <= max;
      }
      return true;
    },
  }),
  columnHelper.accessor("status", {
    header: "상태",
    cell: (info) => (
      <StatusChip
        label={
          info.getValue() === "active"
            ? "재직중"
            : info.getValue() === "vacation"
            ? "휴가중"
            : "퇴사"
        }
        status={info.getValue()}
        size="small"
      />
    ),
    filterFn: "equals",
  }),
];

interface Props {
  data: Person[];
}

const TableWrapper = styled(Box)({
  width: "100%",
  overflowX: "auto",
  "& table": {
    minWidth: "800px",
    width: "100%",
  },
});

export function TanStackTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="전체 검색..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          size="small"
          sx={{ maxWidth: "400px" }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
        <Tooltip title="필터 표시/숨기기">
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableWrapper>
        <Paper
          elevation={1}
          sx={{
            boxShadow: 1,
            "& .MuiPaper-root": {
              boxShadow: "none",
            },
          }}
        >
          <Table>
            <TableHead>
              {showFilters && (
                <TableRow>
                  {table.getAllLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      {column.getCanFilter() ? (
                        <FilterComponent column={column} table={table} />
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              )}
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <StyledTableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <SortIcon
                            sx={{
                              fontSize: "small",
                              color: header.column.getIsSorted()
                                ? "primary.main"
                                : "action.disabled",
                            }}
                          />
                        )}
                      </Box>
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <StyledTableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={table.getFilteredRowModel().rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-toolbar": {
                minHeight: "52px",
                paddingLeft: 2,
                paddingRight: 2,
              },
              ".MuiTablePagination-select": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          />
        </Paper>
      </TableWrapper>
    </Box>
  );
}
