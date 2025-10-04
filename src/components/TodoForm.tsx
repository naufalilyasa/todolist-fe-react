import { Form, Input, Select, Button, Tag, Spin } from "antd";
import { useCategories } from "@/hooks/useCategories";
import type { CreateTodoInput } from "@/validation/todo";
import { useEffect } from "react";
import type { Todo } from "@/types/todo";

type Props = {
  todo?: Todo;
  onSubmit: (data: CreateTodoInput) => void;
  isLoading?: boolean;
};

const TodoForm = ({ onSubmit, isLoading, todo }: Props) => {
  const [form] = Form.useForm<CreateTodoInput>();
  const { categories } = useCategories();

  useEffect(() => {
    if (todo) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        category_id: parseInt(todo.category.id),
      });
    }
  }, [todo, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={(values) => {
        onSubmit({ ...values, is_completed: false });
        form.resetFields();
      }}
      initialValues={{
        title: "",
        description: "",
        priority: "medium",
        category_id: undefined,
      }}
    >
      {/* Title */}
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input />
      </Form.Item>

      {/* Description */}
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      {/* Priority (strict validation) */}
      <Form.Item
        label="Priority"
        name="priority"
        rules={[
          { required: true, message: "Priority is required" },
          {
            validator: (_, value) => {
              if (!value) return Promise.reject("Priority is required");
              if (!["high", "medium", "low"].includes(value)) {
                return Promise.reject("Priority must be High, Medium, or Low");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Select>
          <Select.Option value="high">High</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="low">Low</Select.Option>
        </Select>
      </Form.Item>

      {/* Category */}
      <Form.Item
        label="Category"
        name="category_id"
        rules={[{ required: true, message: "Category is required" }]}
      >
        {categories.isLoading ? (
          <Spin />
        ) : (
          <Select placeholder="Select category">
            {categories?.data?.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                <Tag color={cat.color}>{cat.name}</Tag>
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>

      {/* Submit Button */}
      <Button type="primary" htmlType="submit" loading={isLoading} block>
        Save
      </Button>
    </Form>
  );
};

export default TodoForm;
