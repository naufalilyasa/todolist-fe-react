import { Modal } from "antd";
import TodoForm from "./TodoForm";
import { type CreateTodoInput } from "@/validation/todo";
import type { Todo } from "@/types/todo";

type Props = {
  todo?: Todo;
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateTodoInput) => void;
  title?: string;
  isLoading?: boolean;
};

const TodoFormModal = ({
  todo,
  open,
  onCancel,
  onSubmit,
  title,
  isLoading,
}: Props) => {
  return (
    <Modal open={open} title={title} footer={null} onCancel={onCancel}>
      <TodoForm onSubmit={onSubmit} isLoading={isLoading} todo={todo ? todo : undefined} />
    </Modal>
  );
};

export default TodoFormModal;
