// @ts-nocheck
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  InputRef,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Person } from "../../data/sampleData";

const { Title } = Typography;
const { Option } = Select;

interface TableSettings {
  pageSize: number;
  dense: boolean;
  showBorders: boolean;
}

export function AntTable({ data: initialData }: { data: Person[] }) {
  const [data, setData] = useState<Person[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState<Person[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [settings, setSettings] = useState<TableSettings>({
    pageSize: 10,
    dense: false,
    showBorders: true,
  });
  const searchInput = useRef<typeof Input>(null);

  // 검색 필터 핸들러
  const handleSearch = (selectedKeys: string[], confirm: () => void) => {
    confirm();
    setSearchText(selectedKeys[0]);
    console.log(searchText);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // 데이터 내보내기
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "직원데이터");
    XLSX.writeFile(wb, "employee_data.xlsx");
    message.success("데이터가 성공적으로 내보내졌습니다.");
  };

  // 데이터 새로고침
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData([...initialData]);
      message.success("데이터가 새로고침되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 행 편집
  const handleEdit = (record: Person) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
    setIsModalVisible(true);
  };

  // 행 삭제
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "정말 삭제하시겠습니까?",
      content: "이 작업은 되돌릴 수 없습니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        setData(data.filter((item) => item.id !== id));
        message.success("항목이 삭제되었습니다.");
      },
    });
  };

  // 새 항목 추가
  const handleAdd = () => {
    form.resetFields();
    setEditingKey(null);
    setIsModalVisible(true);
  };

  // 모달 저장
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingKey === null) {
        // 새 항목 추가
        const newPerson = {
          ...values,
          id: Math.max(...data.map((p) => p.id)) + 1,
        };
        setData([...data, newPerson]);
        message.success("새 항목이 추가되었습니다.");
      } else {
        // 기존 항목 수정
        setData(
          data.map((item) =>
            item.id === editingKey ? { ...item, ...values } : item
          )
        );
        message.success("항목이 수정되었습니다.");
      }
      setIsModalVisible(false);
      setEditingKey(null);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  const getColumnSearchProps = (dataIndex: keyof Person) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (keys: string[]) => void;
      selectedKeys: string[];
      confirm: () => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput as any}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            검색
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            초기화
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: Person) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()) ?? false,
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<Person> = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
      fixed: "left",
    },
    {
      title: "직책",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "개발자", value: "개발자" },
        { text: "디자이너", value: "디자이너" },
        { text: "매니저", value: "매니저" },
      ],
      onFilter: (value, record) => record.role.includes(value.toString()),
    },
    {
      title: "부서",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "개발팀", value: "개발팀" },
        { text: "디자인팀", value: "디자인팀" },
        { text: "기획팀", value: "기획팀" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "나이",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      ...getColumnSearchProps("age"),
    },
    {
      title: "연봉",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (salary) =>
        new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
          maximumFractionDigits: 0,
        }).format(salary),
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "재직중", value: "active" },
        { text: "휴가중", value: "vacation" },
        { text: "퇴사", value: "resigned" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag
          color={
            status === "active"
              ? "success"
              : status === "vacation"
              ? "warning"
              : "error"
          }
        >
          {status === "active"
            ? "재직중"
            : status === "vacation"
            ? "휴가중"
            : "퇴사"}
        </Tag>
      ),
    },
    {
      title: "작업",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="수정">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const toolbarMenu = (
    <Menu>
      <Menu.Item key="export" icon={<ExportOutlined />} onClick={handleExport}>
        Excel 내보내기
      </Menu.Item>
      <Menu.Item
        key="refresh"
        icon={<ReloadOutlined />}
        onClick={handleRefresh}
      >
        새로고침
      </Menu.Item>
      <Menu.SubMenu
        key="settings"
        icon={<SettingOutlined />}
        title="테이블 설정"
      >
        <Menu.Item key="pageSize">
          <Select
            value={settings.pageSize}
            onChange={(value) => setSettings({ ...settings, pageSize: value })}
          >
            <Option value={10}>10행</Option>
            <Option value={20}>20행</Option>
            <Option value={50}>50행</Option>
          </Select>
        </Menu.Item>
        <Menu.Item key="dense">
          <Space>
            조밀한 뷰
            <Select
              value={settings.dense}
              onChange={(value) => setSettings({ ...settings, dense: value })}
            >
              <Option value={true}>켜기</Option>
              <Option value={false}>끄기</Option>
            </Select>
          </Space>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5}>직원 관리 테이블</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              새 항목
            </Button>
            <Dropdown overlay={toolbarMenu}>
              <Button icon={<SettingOutlined />}>테이블 설정</Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>

      <Table<Person>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: settings.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `총 ${total}개 항목`,
        }}
        scroll={{ x: 1300, y: 500 }}
        rowKey="id"
        size={settings.dense ? "small" : "middle"}
        bordered={settings.showBorders}
        rowSelection={{
          type: "checkbox",
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        summary={(pageData) => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                선택된 항목: {selectedRows.length}개
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={3}>
                평균 연봉:{" "}
                {new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                  maximumFractionDigits: 0,
                }).format(
                  pageData.reduce((acc, curr) => acc + curr.salary, 0) /
                    pageData.length
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Modal
        title={editingKey === null ? "새 항목 추가" : "항목 수정"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="이름"
            rules={[{ required: true, message: "이름을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="직책"
            rules={[{ required: true, message: "직책을 선택해주세요" }]}
          >
            <Select>
              <Option value="개발자">개발자</Option>
              <Option value="디자이너">디자이너</Option>
              <Option value="매니저">매니저</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="department"
            label="부서"
            rules={[{ required: true, message: "부서를 선택해주세요" }]}
          >
            <Select>
              <Option value="개발팀">개발팀</Option>
              <Option value="디자인팀">디자인팀</Option>
              <Option value="기획팀">기획팀</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="나이"
            rules={[{ required: true, message: "나이를 입력해주세요" }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="salary"
            label="연봉"
            rules={[{ required: true, message: "연봉을 입력해주세요" }]}
          >
            <InputNumber
              min={0}
              step={1000000}
              formatter={(value) =>
                `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value!.replace(/\₩\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="상태"
            rules={[{ required: true, message: "상태를 선택해주세요" }]}
          >
            <Select>
              <Option value="active">재직중</Option>
              <Option value="vacation">휴가중</Option>
              <Option value="resigned">퇴사</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
