import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
  GridRenderCellParams,
  GridFilterModel,
  GridSortModel,
  GridRowParams,
  MuiEvent,
  GridCallbackDetails,
  GridRowSelectionModel,
  GridCellEditStopParams,
} from "@mui/x-data-grid";
import { Person } from "../../data/sampleData";
import { Box, Chip, Typography, Paper, LinearProgress } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "이름",
    width: 130,
    editable: true,
    filterable: true,
  },
  {
    field: "role",
    headerName: "직책",
    width: 180,
    editable: true,
    filterable: true,
  },
  {
    field: "department",
    headerName: "부서",
    width: 130,
    editable: true,
    filterable: true,
    groupable: true,
  },
  {
    field: "age",
    headerName: "나이",
    width: 90,
    editable: true,
    type: "number",
    filterable: true,
    valueGetter: (params: GridValueGetterParams) => params.row.age,
    renderCell: (params: GridRenderCellParams) => (
      <Typography>{params.value.toLocaleString()}세</Typography>
    ),
  },
  {
    field: "salary",
    headerName: "연봉",
    width: 160,
    editable: true,
    type: "number",
    filterable: true,
    valueGetter: (params: GridValueGetterParams) => params.row.salary,
    valueFormatter: (params) =>
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(params.value),
  },
  {
    field: "status",
    headerName: "상태",
    width: 120,
    editable: true,
    type: "singleSelect",
    valueOptions: ["active", "vacation", "resigned"],
    filterable: true,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={
          params.value === "active"
            ? "재직중"
            : params.value === "vacation"
            ? "휴가중"
            : "퇴사"
        }
        color={
          params.value === "active"
            ? "success"
            : params.value === "vacation"
            ? "warning"
            : "error"
        }
        size="small"
      />
    ),
  },
];

interface Props {
  data: Person[];
}

export function MUIDataGrid({ data }: Props) {
  const [pageSize, setPageSize] = useState(5);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // 행 클릭 핸들러
  const handleRowClick = (
    params: GridRowParams,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails
  ) => {
    console.log("Row clicked:", params.row, event, details);
  };

  // 셀 편집 완료 핸들러
  const handleCellEditCommit = (params: GridCellEditStopParams) => {
    console.log("Cell edited:", params);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          // 기본 설정
          rows={data}
          columns={columns}
          getRowId={(row) => row.id}
          // 페이지네이션
          pagination
          paginationModel={{ page: 0, pageSize: pageSize }}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          pageSizeOptions={[5, 10, 20, 50]}
          // 도구 모음
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LinearProgress,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          // 선택 기능
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          // 필터링
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          // 정렬
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          // 편집
          editMode="row"
          onCellEditStop={handleCellEditCommit}
          // 이벤트
          onRowClick={handleRowClick}
          // 상태
          // loading={loading}
          // 기타 기능
          disableColumnMenu={false}
          disableColumnFilter={false}
          disableColumnSelector={false}
          disableDensitySelector={false}
          // 스타일링
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          // 고급 기능
          density="comfortable"
        />
      </Box>
    </Paper>
  );
}
