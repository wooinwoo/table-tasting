import { useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  ColumnApi,
  ValueGetterParams,
  ICellRendererParams,
} from "ag-grid-community";
import { Person } from "../../data/sampleData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button, Space, Tooltip, message } from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

// 상태 셀 렌더러
const StatusCellRenderer = (props: ICellRendererParams) => {
  const value = props.value;
  const color =
    value === "active"
      ? "#4caf50"
      : value === "vacation"
      ? "#ff9800"
      : "#f44336";
  const text =
    value === "active" ? "재직중" : value === "vacation" ? "휴가중" : "퇴사";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
      }}
    >
      {text}
    </span>
  );
};

// 작업 버튼 셀 렌더러
const ActionCellRenderer = (props: ICellRendererParams) => {
  const onEdit = () => {
    message.info(`${props.data.name} 수정`);
  };

  const onDelete = () => {
    message.warning(`${props.data.name} 삭제`);
  };

  return (
    <Space>
      <Button size="small" type="link" onClick={onEdit}>
        수정
      </Button>
      <Button size="small" type="link" danger onClick={onDelete}>
        삭제
      </Button>
    </Space>
  );
};

const columns: ColDef[] = [
  {
    field: "name",
    headerName: "이름",
    filter: true,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "left",
    minWidth: 150,
  },
  {
    field: "role",
    headerName: "직책",
    filter: true,
    minWidth: 120,
  },
  {
    field: "department",
    headerName: "부서",
    filter: true,
    minWidth: 120,
  },
  {
    field: "age",
    headerName: "나이",
    filter: "agNumberColumnFilter",
    minWidth: 100,
    valueGetter: (params: ValueGetterParams) => {
      return params.data?.age;
    },
  },
  {
    field: "salary",
    headerName: "연봉",
    filter: "agNumberColumnFilter",
    minWidth: 150,
    valueFormatter: (params) =>
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(params.value),
    valueGetter: (params: ValueGetterParams) => params.data?.salary,
  },
  {
    field: "status",
    headerName: "상태",
    filter: true,
    cellRenderer: StatusCellRenderer,
    minWidth: 120,
    filterParams: {
      filterOptions: ["equals"],
      values: ["active", "vacation", "resigned"],
    },
  },
  {
    headerName: "작업",
    field: "actions",
    sortable: false,
    filter: false,
    pinned: "right",
    cellRenderer: ActionCellRenderer,
    minWidth: 120,
  },
];

interface Props {
  data: Person[];
}

export function AGGridTable({ data }: Props) {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [quickFilter, setQuickFilter] = useState<string>("");

  // 그리드 초기화
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    // 자동 컬럼 크기 조정
    params.api.sizeColumnsToFit();

    // 창 크기 변경 시 자동 조정
    window.addEventListener("resize", () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  // 선택된 행 개수 업데이트
  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedCount(selectedRows.length);
    }
  }, [gridApi]);

  // CSV 내보내기
  const exportToCsv = useCallback(() => {
    if (gridApi) {
      const params = {
        skipHeader: false,
        skipFooters: true,
        skipGroups: true,
        fileName: "직원_데이터.csv",
      };
      gridApi.exportDataAsCsv(params);
      message.success("CSV 파일이 다운로드되었습니다.");
    }
  }, [gridApi]);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
      setTimeout(() => {
        gridApi.setRowData(data);
        gridApi.hideOverlay();
        message.success("데이터가 새로고침되었습니다.");
      }, 500);
    }
  }, [gridApi, data]);

  // 전체화면 토글
  const toggleFullscreen = useCallback(() => {
    const gridElement = document.querySelector(".ag-theme-material");
    if (gridElement) {
      if (!document.fullscreenElement) {
        gridElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }, []);

  // 빠른 검색 필터
  const onFilterTextBoxChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuickFilter(value);
      if (gridApi) {
        gridApi.setQuickFilter(value);
      }
    },
    [gridApi]
  );

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <span>선택된 항목: {selectedCount}개</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchOutlined style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="빠른 검색..."
              value={quickFilter}
              onChange={onFilterTextBoxChanged}
              style={{
                padding: "4px 8px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
              }}
            />
          </div>
        </Space>
        <Space>
          <Tooltip title="CSV 내보내기">
            <Button icon={<DownloadOutlined />} onClick={exportToCsv}>
              내보내기
            </Button>
          </Tooltip>
          <Tooltip title="새로고침">
            <Button icon={<ReloadOutlined />} onClick={refreshData}>
              새로고침
            </Button>
          </Tooltip>
          <Tooltip title="전체화면">
            <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen}>
              전체화면
            </Button>
          </Tooltip>
        </Space>
      </Space>

      <div
        className="ag-theme-material"
        style={{
          width: "100%",
          flex: 1,
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          domLayout="normal"
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          suppressMenuHide={true}
          overlayLoadingTemplate="<span class='ag-overlay-loading-center'>데이터를 불러오는 중...</span>"
          overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>데이터가 없습니다.</span>"
        />
      </div>
    </div>
  );
}
