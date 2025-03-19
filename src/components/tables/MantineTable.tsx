import { useState, useMemo } from "react";
import {
  Table,
  ScrollArea,
  Group,
  Text,
  TextInput,
  Button,
  Badge,
  ActionIcon,
  Menu,
  Checkbox,
  Select,
  Modal,
  NumberInput,
  Stack,
  Paper,
  rem,
  UnstyledButton,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconSearch,
  IconDownload,
  IconRefresh,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconPlus,
} from "@tabler/icons-react";
import { Person } from "../../data/sampleData";
import { createStyles } from "@mantine/styles";

const useStyles = createStyles((theme: any) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    zIndex: 1,

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  tableWrapper: {
    minHeight: rem(400),
  },

  scrollArea: {
    height: `calc(100vh - ${rem(280)})`,
  },

  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  sortIcon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

interface Props {
  data: Person[];
}

export function MantineTable({ data: initialData }: Props) {
  const { classes } = useStyles();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Person | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      role: "",
      department: "",
      age: 20,
      salary: 30000000,
      status: "active",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "이름은 2글자 이상이어야 합니다" : null,
      age: (value) => (value < 18 ? "나이는 18세 이상이어야 합니다" : null),
      salary: (value) => (value < 0 ? "연봉은 0 이상이어야 합니다" : null),
    },
  });

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return reverseSortDirection ? 1 : -1;
        if (a[sortBy] > b[sortBy]) return reverseSortDirection ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortBy, reverseSortDirection, statusFilter]);

  const setSorting = (field: keyof Person) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleEdit = (person: Person) => {
    setEditingId(person.id);
    form.setValues(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = form.onSubmit((values) => {
    if (editingId) {
      setData((prev: Person[]) =>
        prev.map((item: Person) =>
          item.id === editingId ? { ...values, id: editingId } : item
        )
      );
    } else {
      const newId = Math.max(...data.map((item) => item.id)) + 1;
      setData((prev) => [...prev, { ...values, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    form.reset();
  });

  const toggleRow = (id: number) => {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((current) =>
      current.length === filteredData.length
        ? []
        : filteredData.map((item) => item.id)
    );
  };

  const exportToCsv = () => {
    const headers = ["이름,직책,부서,나이,연봉,상태\n"];
    const rows = filteredData
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

  const refreshData = () => {
    setData(initialData);
  };

  return (
    <Paper p="md" radius="md" withBorder className={classes.tableWrapper}>
      <Group position="apart" mb="md">
        <Group>
          <TextInput
            placeholder="검색..."
            icon={<IconSearch size={14} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            placeholder="상태 필터"
            value={statusFilter}
            onChange={setStatusFilter}
            icon={<IconFilter size={14} />}
            clearable
            data={[
              { value: "active", label: "재직중" },
              { value: "vacation", label: "휴가중" },
              { value: "resigned", label: "퇴사" },
            ]}
          />
        </Group>
        <Group>
          <Button
            leftIcon={<IconPlus size={14} />}
            onClick={() => {
              setEditingId(null);
              form.reset();
              setIsModalOpen(true);
            }}
          >
            신규 등록
          </Button>
          <Button
            leftIcon={<IconDownload size={14} />}
            variant="outline"
            onClick={exportToCsv}
          >
            내보내기
          </Button>
          <Button
            leftIcon={<IconRefresh size={14} />}
            variant="outline"
            onClick={refreshData}
          >
            새로고침
          </Button>
        </Group>
      </Group>

      <ScrollArea className={classes.scrollArea}>
        <Table striped highlightOnHover>
          <thead className={classes.header}>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selectedRows.length === filteredData.length}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length !== filteredData.length
                  }
                />
              </th>
              <th className={classes.th}>
                <UnstyledButton
                  onClick={() => setSorting("name")}
                  className={classes.control}
                >
                  <Group position="apart">
                    <Text fw={500} size="sm">
                      이름
                    </Text>
                    {sortBy === "name" && (
                      <Center className={classes.sortIcon}>
                        {reverseSortDirection ? (
                          <IconSortAscending size={14} />
                        ) : (
                          <IconSortDescending size={14} />
                        )}
                      </Center>
                    )}
                  </Group>
                </UnstyledButton>
              </th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onChange={() => toggleRow(item.id)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>{item.department}</td>
                <td>{item.age}</td>
                <td>
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                    maximumFractionDigits: 0,
                  }).format(item.salary)}
                </td>
                <td>
                  <Badge
                    color={
                      item.status === "active"
                        ? "green"
                        : item.status === "vacation"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {item.status === "active"
                      ? "재직중"
                      : item.status === "vacation"
                      ? "휴가중"
                      : "퇴사"}
                  </Badge>
                </td>
                <td>
                  <Group spacing={0} position="right">
                    <ActionIcon onClick={() => handleEdit(item)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          icon={<IconTrash size={14} />}
                          onClick={() => handleDelete(item.id)}
                        >
                          삭제
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "직원 정보 수정" : "신규 직원 등록"}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="이름"
              placeholder="이름 입력"
              {...form.getInputProps("name")}
            />
            <TextInput
              required
              label="직책"
              placeholder="직책 입력"
              {...form.getInputProps("role")}
            />
            <TextInput
              required
              label="부서"
              placeholder="부서 입력"
              {...form.getInputProps("department")}
            />
            <NumberInput
              required
              label="나이"
              placeholder="나이 입력"
              min={18}
              max={100}
              {...form.getInputProps("age")}
            />
            <NumberInput
              required
              label="연봉"
              placeholder="연봉 입력"
              min={0}
              step={1000000}
              {...form.getInputProps("salary")}
            />
            <Select
              required
              label="상태"
              placeholder="상태 선택"
              data={[
                { value: "active", label: "재직중" },
                { value: "vacation", label: "휴가중" },
                { value: "resigned", label: "퇴사" },
              ]}
              {...form.getInputProps("status")}
            />
            <Button type="submit">{editingId ? "수정" : "등록"}</Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
}
