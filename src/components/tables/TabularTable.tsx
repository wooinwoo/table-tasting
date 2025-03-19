/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import "tabulator-tables/dist/css/tabulator.min.css";
import { Person } from "../../data/sampleData";
import {
  Button,
  Stack,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface Props {
  data: Person[];
}

export function TabularTable({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Person>>({});
  const [searchValue, setSearchValue] = useState("");
  const tableRef = useRef<any>(null);

  const columns = [
    {
      title: "이름",
      field: "name",
      headerFilter: true,
      editor: "input",
      validator: ["required", "string"],
    },
    {
      title: "직책",
      field: "role",
      headerFilter: true,
      editor: "input",
      validator: ["required", "string"],
    },
    {
      title: "부서",
      field: "department",
      headerFilter: true,
      editor: "input",
      validator: ["required", "string"],
    },
    {
      title: "나이",
      field: "age",
      headerFilter: "number",
      hozAlign: "right",
      editor: "number",
      validator: ["required", "integer", "min:18", "max:100"],
    },
    {
      title: "연봉",
      field: "salary",
      headerFilter: "number",
      formatter: "money",
      formatterParams: {
        decimal: ",",
        thousand: ",",
        symbol: "₩",
        precision: 0,
      },
      hozAlign: "right",
      editor: "number",
      validator: ["required", "integer", "min:0"],
    },
    {
      title: "상태",
      field: "status",
      headerFilter: "select",
      headerFilterParams: {
        values: {
          active: "재직중",
          vacation: "휴가중",
          resigned: "퇴사",
        },
      },
      editor: "select",
      editorParams: {
        values: {
          active: "재직중",
          vacation: "휴가중",
          resigned: "퇴사",
        },
      },
      formatter: (cell: any) => {
        const value = cell.getValue();
        const color =
          value === "active"
            ? "#4caf50"
            : value === "vacation"
            ? "#ff9800"
            : "#f44336";
        const text =
          value === "active"
            ? "재직중"
            : value === "vacation"
            ? "휴가중"
            : "퇴사";
        return `<span style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${text}</span>`;
      },
    },
    {
      title: "작업",
      formatter: function () {
        return '<button class="edit-btn">수정</button><button class="delete-btn">삭제</button>';
      },
      cellClick: function (e: any, cell: any) {
        const target = e.target as HTMLElement;
        if (target.classList.contains("edit-btn")) {
          const rowData = cell.getRow().getData();
          setFormData(rowData);
          setIsModalOpen(true);
        } else if (target.classList.contains("delete-btn")) {
          if (confirm("정말 삭제하시겠습니까?")) {
            cell.getRow().delete();
          }
        }
      },
      hozAlign: "center",
      headerSort: false,
    },
  ];

  const options = {
    layout: "fitColumns",
    responsiveLayout: "hide",
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 25, 50, 100],
    movableColumns: true,
    placeholder: "데이터가 없습니다",
    selectable: true,
    selectableRangeMode: "click",
    history: true,
    locale: true,
    langs: {
      "ko-kr": {
        pagination: {
          first: "처음",
          first_title: "첫 페이지",
          last: "마지막",
          last_title: "마지막 페이지",
          prev: "이전",
          prev_title: "이전 페이지",
          next: "다음",
          next_title: "다음 페이지",
        },
      },
    },
  };

  useEffect(() => {
    if (tableRef.current) {
      const table = tableRef.current.table;
      table.setLocale("ko-kr");

      // 전역 검색 필터 적용
      if (searchValue) {
        table.setFilter(customFilter);
      } else {
        table.clearFilter();
      }
    }
  }, [searchValue]);

  const customFilter = (data: any) => {
    const searchLower = searchValue.toLowerCase();
    return Object.values(data).some(
      (value) => value && value.toString().toLowerCase().includes(searchLower)
    );
  };

  const downloadCSV = () => {
    tableRef.current.table.download("csv", "직원_데이터.csv", {
      delimiter: ",",
      bom: true,
    });
  };

  const refreshData = () => {
    setData(initialData);
  };

  const handleSubmit = () => {
    if (formData.id) {
      tableRef.current.table.updateData([formData]);
    } else {
      const newId = Math.max(...data.map((item) => item.id)) + 1;
      tableRef.current.table.addData([{ ...formData, id: newId }]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="전체 검색..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({});
            setIsModalOpen(true);
          }}
        >
          신규 등록
        </Button>
        <Tooltip title="CSV 내보내기">
          <IconButton onClick={downloadCSV}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="새로고침">
          <IconButton onClick={refreshData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <ReactTabulator
        ref={tableRef}
        data={data}
        columns={columns as any}
        options={options}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          {formData.id ? "직원 정보 수정" : "신규 직원 등록"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
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
            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={formData.status || ""}
                label="상태"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    status: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="active">재직중</MenuItem>
                <MenuItem value="vacation">휴가중</MenuItem>
                <MenuItem value="resigned">퇴사</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {formData.id ? "수정" : "등록"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
