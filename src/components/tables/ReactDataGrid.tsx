import { FC, Component, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import {
  TypeColumn,
  TypeFilterTypes,
  TypeFilterValue,
} from "@inovua/reactdatagrid-community/types";
import { Person } from "../../data/sampleData";

// 필터 타입 정의
const filterTypes = {
  string: {
    name: "string",
    operators: [
      {
        name: "contains",
        fn: (value: string, filterValue: string) =>
          value.toLowerCase().includes(filterValue.toLowerCase()),
      },
      {
        name: "notContains",
        fn: (value: string, filterValue: string) =>
          !value.toLowerCase().includes(filterValue.toLowerCase()),
      },
      {
        name: "eq",
        fn: (value: string, filterValue: string) => value === filterValue,
      },
    ],
  },
  number: {
    name: "number",
    operators: [
      {
        name: "gte",
        fn: (value: number, filterValue: number) => value >= filterValue,
      },
      {
        name: "lte",
        fn: (value: number, filterValue: number) => value <= filterValue,
      },
      {
        name: "eq",
        fn: (value: number, filterValue: number) => value === filterValue,
      },
    ],
  },
};

// 상태 옵션 정의
const statusOptions = [
  { id: "active", label: "재직중" },
  { id: "vacation", label: "휴가중" },
  { id: "resigned", label: "퇴사" },
];

// 초기 필터 설정 수정
const filterValue = [
  { name: "name", operator: "contains", type: "string", value: "" },
  { name: "role", operator: "contains", type: "string", value: "" },
  { name: "department", operator: "contains", type: "string", value: "" },
  { name: "age", operator: "gte", type: "number", value: null },
  { name: "salary", operator: "gte", type: "number", value: null },
  { name: "status", operator: "eq", type: "string", value: null },
];

const columns: TypeColumn[] = [
  {
    name: "name",
    header: "이름",
    minWidth: 100,
    defaultFlex: 1,
    filterEditor: "string" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "이름 검색...",
      operators: filterTypes.string.operators,
    },
  },
  {
    name: "role",
    header: "직책",
    minWidth: 120,
    defaultFlex: 1,
    filterEditor: "string" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "직책 검색...",
      operators: filterTypes.string.operators,
    },
  },
  {
    name: "department",
    header: "부서",
    minWidth: 120,
    defaultFlex: 1,
    filterEditor: "string" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "부서 검색...",
      operators: filterTypes.string.operators,
    },
  },
  {
    name: "age",
    header: "나이",
    minWidth: 80,
    defaultFlex: 1,
    filterEditor: "number" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "나이...",
      operators: filterTypes.number.operators,
    },
    render: ({ value }: { value: number }) => value.toLocaleString(),
  },
  {
    name: "salary",
    header: "연봉",
    minWidth: 130,
    defaultFlex: 1,
    filterEditor: "number" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "연봉...",
      operators: filterTypes.number.operators,
    },
    render: ({ value }: { value: number }) =>
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(value),
  },
  {
    name: "status",
    header: "상태",
    minWidth: 100,
    defaultFlex: 1,
    filterEditor: "select" as unknown as typeof Component | FC | undefined,
    filterEditorProps: {
      placeholder: "상태 선택",
      options: statusOptions,
    },
    render: ({ value }: { value: string }) => {
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
      return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
    },
  },
];

interface Props {
  data: Person[];
}

export function InovuaDataGrid({ data }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<TypeFilterValue>(filterValue);

  const gridStyle = {
    minHeight: 400,
    maxHeight: 600,
  };

  return (
    <ReactDataGrid
      idProperty="id"
      columns={columns}
      dataSource={data}
      style={gridStyle}
      pagination
      defaultLimit={10}
      pageSizes={[5, 10, 20, 50]}
      showColumnMenuTool
      enableColumnFilterContextMenu
      sortable
      checkboxColumn
      selected={selected}
      onSelectionChange={(config) => {
        setSelected(config.selected as Record<string, boolean>);
      }}
      resizable
      reorderColumns
      showCellBorders
      showZebraRows
      filterTypes={filterTypes as unknown as TypeFilterTypes}
      defaultFilterValue={filterValue}
      filterValue={filter}
      onFilterValueChange={setFilter}
    />
  );
}
