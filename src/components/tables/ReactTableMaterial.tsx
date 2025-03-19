import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  TablePagination,
  Toolbar,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Person } from "../../data/sampleData";

interface Props {
  data: Person[];
}

export function ReactTableMaterial({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Person | null>(null);
  const [formData, setFormData] = useState<Partial<Person>>({});

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "이름",
      },
      {
        accessorKey: "role",
        header: "직책",
      },
      {
        accessorKey: "department",
        header: "부서",
      },
      {
        accessorKey: "age",
        header: "나이",
      },
      {
        accessorKey: "salary",
        header: "연봉",
        cell: ({ getValue }) =>
          new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
            maximumFractionDigits: 0,
          }).format(getValue<number>()),
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Chip
              label={
                status === "active"
                  ? "재직중"
                  : status === "vacation"
                  ? "휴가중"
                  : "퇴사"
              }
              color={
                status === "active"
                  ? "success"
                  : status === "vacation"
                  ? "warning"
                  : "error"
              }
              size="small"
            />
          );
        },
      },
      {
        id: "actions",
        header: "작업",
        cell: ({ row }) => (
          <>
            <IconButton size="small" onClick={() => handleEdit(row.original)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (row: Person) => {
    setEditingRow(row);
    setFormData(row);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (editingRow) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingRow.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newId = Math.max(...data.map((item) => item.id)) + 1;
      setData((prev) => [...prev, { ...formData, id: newId } as Person]);
    }
    setIsModalOpen(false);
    setEditingRow(null);
    setFormData({});
  };

  const exportToCsv = () => {
    const headers = ["이름,직책,부서,나이,연봉,상태\n"];
    const rows = data
      .map((item) =>
        [
          item.name,
          item.role,
          item.department,
          item.age,
          item.salary,
          item.status,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "직원_데이터.csv";
    link.click();
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          직원 목록
        </Typography>
        <TextField
          size="small"
          placeholder="검색..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
          }}
          sx={{ mr: 2 }}
        />
        <Tooltip title="신규 등록">
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingRow(null);
              setFormData({});
              setIsModalOpen(true);
            }}
          >
            신규 등록
          </Button>
        </Tooltip>
        <Tooltip title="내보내기">
          <IconButton onClick={exportToCsv}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="새로고침">
          <IconButton onClick={() => setData(initialData)}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          {editingRow ? "직원 정보 수정" : "신규 직원 등록"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="이름"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="직책"
              value={formData.role || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            />
            <TextField
              label="부서"
              value={formData.department || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
            />
            <TextField
              label="나이"
              type="number"
              value={formData.age || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  age: Number(e.target.value),
                }))
              }
            />
            <TextField
              label="연봉"
              type="number"
              value={formData.salary || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  salary: Number(e.target.value),
                }))
              }
            />
            <Select
              value={formData.status || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as string,
                }))
              }
              label="상태"
            >
              <MenuItem value="active">재직중</MenuItem>
              <MenuItem value="vacation">휴가중</MenuItem>
              <MenuItem value="resigned">퇴사</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRow ? "수정" : "등록"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
