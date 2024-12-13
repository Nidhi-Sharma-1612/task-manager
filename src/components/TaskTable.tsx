import React from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  status: boolean;
}

const TaskTable: React.FC<{
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}> = ({ tasks, onEdit, onDelete }) => {
  const columns: ColumnsType<Task> = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      filterSearch: true,
      onFilter: (value, record) => record.title.includes(value as string),
      filters: Array.from(new Set(tasks.map((task) => task.title))).map(
        (title) => ({ text: title, value: title })
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      sorter: (a, b) => a.priority.localeCompare(b.priority),
      filters: [
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority: string) => {
        let color = "text-green-500";
        if (priority === "High") color = "text-red-500";
        else if (priority === "Medium") color = "text-yellow-500";
        return <span className={`${color} font-bold`}>{priority}</span>;
      },
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      sorter: (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      defaultSortOrder: "ascend",
      render: (dueDate) => {
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(dueDate));
        return <span>{formattedDate}</span>;
      },
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (status ? "Completed" : "Not Completed"),
      filters: [
        { text: "Completed", value: true },
        { text: "Not Completed", value: false },
      ],
      onFilter: (value, record) => record.status === value,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record.id)}
          />
        </div>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="h-[calc(100vh-150px)] overflow-hidden">
      <Table
        className="bg-white shadow rounded-lg h-full"
        columns={columns}
        dataSource={tasks.map((task, index) => ({
          ...task,
          sno: index + 1,
          key: task.id,
        }))}
        style={{ minHeight: "100%" }}
        pagination={{ pageSize: 6, position: ["bottomCenter"] }}
        bordered
        scroll={{ x: 800, y: "calc(100vh - 250px)" }}
      />
    </div>
  );
};

export default TaskTable;
