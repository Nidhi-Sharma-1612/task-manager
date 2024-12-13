/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Switch, Modal } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  status: boolean;
}

const TaskForm: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editingTask: Task | null;
}> = ({ visible, onClose, onSubmit, editingTask }) => {
  const [form] = Form.useForm();

  // Update form values when editingTask changes
  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        ...editingTask,
        dueDate: dayjs(editingTask.dueDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingTask, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={editingTask ? "Edit Task" : "Add Task"}
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: false }}
      >
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: "Please enter the task title!" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select placeholder="Select priority">
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: "Please select a due date!" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch
            checkedChildren="Completed"
            unCheckedChildren="Not Completed"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {editingTask ? "Update Task" : "Add Task"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
