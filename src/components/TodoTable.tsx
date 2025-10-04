/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table, Tag, Checkbox, Button, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router";
import { type Pagination, type Todo } from "@/types/todo";
import { useTodos } from "@/hooks/useTodos";
import { useState } from "react";
import { useNotificationContext } from "@/hooks/useNotification";
import TodoFormModal from "./TodoFormModal";
import type {
  UpdateTodoInput,
  UpdateToggleCompleteTodoInput,
} from "@/validation/todo";
import { getPriorityColor } from "@/utils/getPriorityColor";

interface TodoTableProps {
  data: Todo[] | undefined;
  pagination: Pagination | undefined;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, size: number) => void;
}

const TodoTable = ({
  data,
  pagination,
  currentPage,
  pageSize,
  onPageChange,
}: TodoTableProps) => {
  const navigate = useNavigate();
  const { openNotificationWithIcon } = useNotificationContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { updateTodo, deleteTodo, toggleComplete } = useTodos();

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (todo: Todo) => {
    Modal.confirm({
      title: "Delete Task",
      content: `Are you sure you want to delete "${todo.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteTodo.mutateAsync(todo.id);
        openNotificationWithIcon(
          "success",
          "Task deleted",
          "The task has been deleted successfully"
        );
      },
    });
  };

  const handleView = (id: string) => {
    navigate(`/todo/${id}`);
  };

  const handleEditSubmit = (values: UpdateTodoInput) => {
    if (editingTodo) {
      updateTodo.mutateAsync({
        todoId: editingTodo.id,
        data: values,
      });
      openNotificationWithIcon(
        "success",
        "Task updated",
        "The task has been updated successfully"
      );
      setIsEditModalOpen(false);
      setEditingTodo(null);
    }
  };

  const handleToggleComplete = ({
    todoId,
    data,
  }: {
    todoId: string;
    data: UpdateToggleCompleteTodoInput;
  }) => {
    try {
      toggleComplete.mutateAsync({ todoId, data });
      openNotificationWithIcon(
        "success",
        data.is_completed ? "Task marked as incomplete" : "Task completed",
        data.is_completed
          ? "The task has been marked as incomplete"
          : "Congratulations! Task completed successfully"
      );
    } catch (err) {
      openNotificationWithIcon("error", "Error", "Failed to update status");
    }
  };

  const columns: ColumnsType<Todo> = [
    {
      title: "Status",
      dataIndex: "is_completed",
      key: "is_completed",
      width: 80,
      render: (completed: boolean, record: Todo) => (
        <Checkbox
          checked={completed}
          onChange={() =>
            handleToggleComplete({
              todoId: record.id,
              data: { is_completed: record.is_completed },
            })
          }
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text: string, record: Todo) => (
        <span
          style={{
            textDecoration: record.is_completed ? "line-through" : "none",
            color: record.is_completed ? "#8c8c8c" : "inherit",
            fontWeight: record.is_completed ? "normal" : 500,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text: string, record: Todo) => (
        <span style={{ color: record.is_completed ? "#8c8c8c" : "inherit" }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: Todo["category"]) => (
        <Tag color={category?.color ?? "blue"}>
          {category?.name || "Uncategorized"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: Todo) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: onPageChange,
          showTotal: (total) => `Total ${total} tasks`,
        }}
      />

      {editingTodo && (
        <TodoFormModal
          todo={editingTodo}
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingTodo(null);
          }}
          onSubmit={handleEditSubmit}
          title="Edit Task"
        />
      )}
    </>
  );
};

export default TodoTable;
