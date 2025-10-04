/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, useNavigate } from "react-router";
import {
  Button,
  Tag,
  Descriptions,
  Layout,
  Card,
  Typography,
  Space,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useNotificationContext } from "@/hooks/useNotification";
import Loading from "@/components/Loading";
import type { CreateTodoInput } from "@/validation/todo";
import TodoFormModal from "@/components/TodoFormModal";
import { getPriorityColor } from "@/utils/getPriorityColor";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
  const { openNotificationWithIcon } = useNotificationContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: todo, isLoading, error } = useTodo(id);

  // Loading state
  if (isLoading) return <Loading />;

  // Error / not found state
  if (error || !todo) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "32px 24px", textAlign: "center" }}>
          <Title level={1}>Task Not Found</Title>
          <Paragraph
            type="secondary"
            style={{ fontSize: 16, marginBottom: 24 }}
          >
            The task you're looking for doesn't exist.
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Content>
      </Layout>
    );
  }

  // Submit Action
  const handleEditSubmit = async (values: CreateTodoInput) => {
    try {
      await updateTodo.mutateAsync({ todoId: todo.id, data: values });
      openNotificationWithIcon(
        "success",
        "Task updated",
        "The task has been updated successfully"
      );
      setIsEditModalOpen(false);
    } catch (err) {
      openNotificationWithIcon("error", "Error", "Failed to update task");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Task",
      content: `Are you sure you want to delete "${todo.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteTodo.mutateAsync(todo.id);
          openNotificationWithIcon(
            "success",
            "Task deleted",
            "The task has been deleted successfully"
          );
          navigate("/");
        } catch (err) {
          openNotificationWithIcon("error", "Error", "Failed to delete task");
        }
      },
    });
  };

  const handleToggleComplete = async () => {
    try {
      await toggleComplete.mutateAsync({
        todoId: todo.id,
        data: { is_completed: !todo.is_completed },
      });
      openNotificationWithIcon(
        "success",
        todo.is_completed ? "Task marked as incomplete" : "Task completed",
        todo.is_completed
          ? "The task has been marked as incomplete"
          : "Congratulations! Task completed successfully"
      );
    } catch (err) {
      openNotificationWithIcon("error", "Error", "Failed to update status");
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        width: "99svw",
        overflowX: "hidden",
        background: "#f5f5f5",
      }}
    >
      <Content style={{ padding: "20px 300px" }}>
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          style={{ marginBottom: 24 }}
          size="large"
        >
          Back to Tasks
        </Button>

        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Title + Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 300 }}>
                <Space align="start" size="middle">
                  <Button
                    type="text"
                    onClick={handleToggleComplete}
                    icon={
                      todo.is_completed ? (
                        <CheckCircleOutlined
                          style={{ fontSize: 32, color: "#52c41a" }}
                        />
                      ) : (
                        <CloseCircleOutlined
                          style={{ fontSize: 32, color: "#d9d9d9" }}
                        />
                      )
                    }
                    style={{ padding: 0, height: "auto" }}
                  />
                  <div>
                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        marginBottom: 12,
                        textDecoration: todo.is_completed
                          ? "line-through"
                          : "none",
                        color: todo.is_completed ? "#8c8c8c" : "inherit",
                      }}
                    >
                      {todo.title}
                    </Title>
                    <Space wrap>
                      <Tag color={getPriorityColor(todo.priority)}>
                        {todo.priority} Priority
                      </Tag>
                      <Tag color="blue">
                        {todo.category?.name || "Uncategorized"}
                      </Tag>
                      {todo.is_completed && <Tag color="green">Completed</Tag>}
                    </Space>
                  </div>
                </Space>
              </div>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  Delete
                </Button>
              </Space>
            </div>

            {/* Description */}
            <div>
              <Title level={4}>Description</Title>
              <Paragraph
                style={{
                  fontSize: 16,
                  color: todo.is_completed ? "#8c8c8c" : "inherit",
                }}
              >
                {todo.description}
              </Paragraph>
            </div>

            {/* Task Details */}
            <div>
              <Title level={4}>Task Details</Title>
              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Task ID">{todo.id}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={todo.is_completed ? "green" : "orange"}>
                    {todo.is_completed ? "Completed" : "Pending"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Priority">
                  <Tag color={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  <Tag color={todo.category.color}>
                    {todo.category?.name || "Uncategorized"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Space>
        </Card>

        {/* Edit Modal */}
        <TodoFormModal
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          title="Edit Task"
          todo={todo}
        />
      </Content>
    </Layout>
  );
};

export default TodoDetail;
