/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { Person } from "../../data/sampleData";
import { Button, Stack, Paper, CircularProgress } from "@mui/material";
import { h } from "gridjs";

interface Props {
  data: Person[];
}

export function GridjsTable({ data: initialData }: Props) {
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 데이터 설정을 useEffect 내에서 처리
    setData(initialData);
    setIsLoading(false);
  }, [initialData]);

  const columns = [
    {
      name: "이름",
      sort: true,
    },
    {
      name: "직책",
      sort: true,
    },
    {
      name: "부서",
      sort: true,
    },
    {
      name: "나이",
      sort: true,
    },
    {
      name: "연봉",
      formatter: (cell: number) =>
        h(
          "span",
          {},
          new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
            maximumFractionDigits: 0,
          }).format(cell)
        ),
      sort: true,
    },
    {
      name: "상태",
      formatter: (cell: string) =>
        h(
          "span",
          {
            className: `status-badge ${cell}`,
          },
          cell === "active" ? "재직중" : cell === "vacation" ? "휴가중" : "퇴사"
        ),
      sort: true,
    },
    {
      name: "작업",
      formatter: (_: any, row: any) =>
        h("div", {}, [
          h(
            "button",
            {
              className: "edit-btn",
              "data-id": row.cells[0].data,
              onClick: () => handleEdit(row.cells[0].data),
            },
            "수정"
          ),
          h(
            "button",
            {
              className: "delete-btn",
              "data-id": row.cells[0].data,
              onClick: () => handleDelete(row.cells[0].data),
            },
            "삭제"
          ),
        ]),
    },
  ];

  const handleEdit = (id: number) => {
    // 수정 로직 구현
    console.log("Edit:", id);
  };

  const handleDelete = (id: number) => {
    // 삭제 로직 구현
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // CSV 내보내기 함수 수정
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

  useEffect(() => {
    // 상태 배지 스타일
    const style = document.createElement("style");
    style.textContent = `
      .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      .status-badge.active {
        background-color: #4caf50;
        color: white;
      }
      .status-badge.vacation {
        background-color: #ff9800;
        color: white;
      }
      .status-badge.resigned {
        background-color: #f44336;
        color: white;
      }
      .edit-btn, .delete-btn {
        margin: 0 4px;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .edit-btn {
        background-color: #2196f3;
        color: white;
      }
      .delete-btn {
        background-color: #f44336;
        color: white;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={exportToCsv}>
          CSV 내보내기
        </Button>
        <Button variant="contained" onClick={() => setData(initialData)}>
          새로고침
        </Button>
      </Stack>

      {isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid
          data={data.map((item) => [
            item.name,
            item.role,
            item.department,
            item.age,
            item.salary,
            item.status,
            item.id,
          ])}
          columns={columns}
          search={true}
          pagination={{
            limit: 10,
            summary: true,
          }}
          sort={true}
          language={{
            search: {
              placeholder: "검색...",
            },
            pagination: {
              previous: "이전",
              next: "다음",
              showing: "보기",
              results: () => "건",
              of: "중",
            },
          }}
        />
      )}
    </Paper>
  );
}
