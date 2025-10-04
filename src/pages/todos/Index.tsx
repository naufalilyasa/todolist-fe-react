import {
  Input,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Layout,
  Typography,
  Space,
  Select,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import TodoTable from "@/components/TodoTable";
import { useTodos } from "@/hooks/useTodos";
import { useNotificationContext } from "@/hooks/useNotification";
import TodoFormModal from "@/components/TodoFormModal";
import type { CreateTodoInput } from "@/validation/todo";
import Loading from "@/components/Loading";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { AxiosError } from "axios";

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "completed">();
  const [priorityFilter, setPriorityFilter] = useState<
    "High" | "Medium" | "Low"
  >();
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { categories } = useCategories();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { todos, createTodo } = useTodos({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchQuery || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    category_id: categoryFilter || undefined,
  });

  const { openNotificationWithIcon } = useNotificationContext();

  const handleAddTodo = async (values: CreateTodoInput) => {
    try {
      await createTodo.mutateAsync(values);
      openNotificationWithIcon(
        "success",
        "Task added",
        "The task has been added successfully"
      );
      setIsAddModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        openNotificationWithIcon(
          "error",
          "Error",
          `Failed to add task: ${error.response?.data.message}`
        );
      } else {
        openNotificationWithIcon(
          "error",
          "Error",
          `Failed to add task: Server internal error`
        );
      }
    }
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const completedTodos = todos.data?.todos.filter((t) => t.is_completed).length;
  const pendingTodos = todos.data?.todos.filter((t) => !t.is_completed).length;
  const highPriorityTodos = todos.data?.todos.filter(
    (t) => t.priority === "high" && !t.is_completed
  ).length;

  return todos.isLoading ? (
    <Loading />
  ) : (
    <Layout
      style={{
        minHeight: "100vh",
        width: "99svw",
        overflowX: "hidden",
        background: "#f5f5f5",
      }}
    >
      <Content
        style={{
          padding: "32px 24px",
          margin: "0 auto",
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Space direction="vertical" size="small" style={{ marginBottom: 24 }}>
          <Space align="center" wrap>
            <CheckSquareOutlined style={{ fontSize: 32, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              Todo List Manager
            </Title>
          </Space>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Organize and manage your tasks efficiently
          </Text>
        </Space>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Tasks"
                value={todos.data?.todos.length}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed"
                value={completedTodos}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending"
                value={pendingTodos}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="High Priority"
                value={highPriorityTodos}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters & Search */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[8, 8]} wrap>
            <Col xs={24} md={12}>
              <Search
                placeholder="Search tasks..."
                prefix={<SearchOutlined />}
                allowClear
                size="middle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Status"
                allowClear
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="Priority"
                allowClear
                style={{ width: "100%" }}
                value={priorityFilter}
                onChange={setPriorityFilter}
              >
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Select
                placeholder="Category"
                allowClear
                style={{ width: "100%" }}
                value={categoryFilter}
                onChange={setCategoryFilter}
              >
                {categories.data?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Todo Table */}
        <Card style={{ marginBottom: 24 }}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                All Tasks
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Task
              </Button>
            </Col>
          </Row>

          {/* Scrollable Table Wrapper */}
          <div style={{ overflowX: "auto" }}>
            <TodoTable
              data={todos.data?.todos}
              pagination={todos.data?.pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>

        {/* Create Todo Form */}
        <TodoFormModal
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTodo}
          title="Add New Task"
          isLoading={createTodo.isPending}
        />
      </Content>
    </Layout>
  );
};

export default Index;
