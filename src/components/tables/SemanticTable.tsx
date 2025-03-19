import { useState, useMemo } from "react";
import {
  Table,
  Label,
  Input,
  Dropdown,
  Pagination,
  Segment,
  Grid,
  Icon,
  DropdownItemProps,
} from "semantic-ui-react";
import { Person } from "../../data/sampleData";
import "semantic-ui-css/semantic.min.css";

interface Props {
  data: Person[];
}

type SortDirection = "ascending" | "descending" | undefined;
type SortField = keyof Person | null;

export function SemanticTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statusOptions = [
    { key: "all", text: "전체", value: null },
    { key: "active", text: "재직중", value: "active" },
    { key: "vacation", text: "휴가중", value: "vacation" },
    { key: "resigned", text: "퇴사", value: "resigned" },
  ];

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
    if (sortField && sortDirection) {
      processed.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return processed;
  }, [data, searchTerm, sortField, sortDirection, statusFilter]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (clickedColumn: keyof Person) => {
    if (sortField !== clickedColumn) {
      setSortField(clickedColumn);
      setSortDirection("ascending");
      return;
    }

    setSortDirection(
      sortDirection === "ascending" ? "descending" : "ascending"
    );
  };

  return (
    <Segment>
      <Grid columns={2} stackable>
        <Grid.Column>
          <Input
            icon="search"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fluid
          />
        </Grid.Column>
        <Grid.Column>
          <Dropdown
            placeholder="상태 필터"
            selection
            options={statusOptions as DropdownItemProps[]}
            value={statusFilter ?? ""}
            onChange={(_, data) => setStatusFilter(data.value as string | null)}
            fluid
          />
        </Grid.Column>
      </Grid>

      <Table celled sortable selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={sortField === "name" ? sortDirection : undefined}
              onClick={() => handleSort("name")}
            >
              이름{" "}
              {sortField === "name" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortField === "role" ? sortDirection : undefined}
              onClick={() => handleSort("role")}
            >
              직책{" "}
              {sortField === "role" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortField === "department" ? sortDirection : undefined}
              onClick={() => handleSort("department")}
            >
              부서{" "}
              {sortField === "department" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortField === "age" ? sortDirection : undefined}
              onClick={() => handleSort("age")}
            >
              나이{" "}
              {sortField === "age" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortField === "salary" ? sortDirection : undefined}
              onClick={() => handleSort("salary")}
            >
              연봉{" "}
              {sortField === "salary" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortField === "status" ? sortDirection : undefined}
              onClick={() => handleSort("status")}
            >
              상태{" "}
              {sortField === "status" && sortDirection && (
                <Icon
                  name={
                    sortDirection === "ascending" ? "arrow up" : "arrow down"
                  }
                />
              )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentData.map((person) => (
            <Table.Row key={person.id}>
              <Table.Cell>{person.name}</Table.Cell>
              <Table.Cell>{person.role}</Table.Cell>
              <Table.Cell>{person.department}</Table.Cell>
              <Table.Cell>{person.age}</Table.Cell>
              <Table.Cell>
                {new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                  maximumFractionDigits: 0,
                }).format(person.salary)}
              </Table.Cell>
              <Table.Cell>
                <Label
                  color={
                    person.status === "active"
                      ? "green"
                      : person.status === "vacation"
                      ? "orange"
                      : "red"
                  }
                >
                  {person.status === "active"
                    ? "재직중"
                    : person.status === "vacation"
                    ? "휴가중"
                    : "퇴사"}
                </Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={6}>
              <Grid columns={2}>
                <Grid.Column>
                  <Dropdown
                    selection
                    compact
                    options={[
                      { key: 5, text: "5개씩 보기", value: 5 },
                      { key: 10, text: "10개씩 보기", value: 10 },
                      { key: 20, text: "20개씩 보기", value: 20 },
                    ]}
                    value={itemsPerPage}
                    onChange={(_, data) => {
                      setItemsPerPage(Number(data.value));
                      setCurrentPage(1);
                    }}
                  />
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Pagination
                    activePage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(_, data) =>
                      setCurrentPage(Number(data.activePage))
                    }
                    ellipsisItem={{
                      content: <Icon name="ellipsis horizontal" />,
                      icon: true,
                    }}
                    firstItem={{
                      content: <Icon name="angle double left" />,
                      icon: true,
                    }}
                    lastItem={{
                      content: <Icon name="angle double right" />,
                      icon: true,
                    }}
                    prevItem={{
                      content: <Icon name="angle left" />,
                      icon: true,
                    }}
                    nextItem={{
                      content: <Icon name="angle right" />,
                      icon: true,
                    }}
                  />
                </Grid.Column>
              </Grid>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Segment>
  );
}
