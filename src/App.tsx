/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, notification, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";

interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  status: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Fetch all tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      const sortedTasks = response.data.sort(
        (a: Task, b: Task) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ); // Sort tasks by dueDate in ascending order
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (values: any) => {
    const newTask: Partial<Task> = {
      title: values.title,
      priority: values.priority,
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      status: values.status || false,
    };

    try {
      if (editingTask) {
        await axios.put(
          `http://localhost:5000/tasks/${editingTask.id}`,
          newTask
        );
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...newTask } : task
        );
        setTasks(
          updatedTasks.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
        ); // Sort tasks after updating
        notification.success({
          message: "Task Updated",
          description: "The task has been successfully updated.",
        });
        setEditingTask(null);
      } else {
        const response = await axios.post(
          "http://localhost:5000/tasks",
          newTask
        );
        const newTasks = [...tasks, response.data];
        setTasks(
          newTasks.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
        ); // Sort tasks after adding
        notification.success({
          message: "Task Added",
          description: "The task has been successfully added.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error Saving Task",
        description: "There was an error saving the task. Please try again.",
      });
      console.error("Error saving task:", error);
    }

    setIsModalOpen(false);
  };

  const confirmDeleteTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setDeleteModalOpen(true);
    } else {
      notification.error({
        message: "Task Not Found",
        description: "The task you are trying to delete does not exist.",
      });
    }
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${taskToDelete.id}`);
        const filteredTasks = tasks.filter(
          (task) => task.id !== taskToDelete.id
        );
        setTasks(
          filteredTasks.sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
        ); // Sort tasks after deletion
        notification.success({
          message: "Task Deleted",
          description: "The task has been successfully deleted.",
        });
      } catch (error) {
        notification.error({
          message: "Error Deleting Task",
          description:
            "There was an error deleting the task. Please try again.",
        });
        console.error("Error deleting task:", error);
      } finally {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
          Task Management App
        </h1>
        <Button
          type="primary"
          size="large"
          className="w-full md:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={confirmDeleteTask}
      />

      <TaskForm
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleAddTask}
        editingTask={editingTask}
      />

      <Modal
        title={
          <span className="text-lg font-bold text-red-600">Confirm Delete</span>
        }
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this task?
        </p>
      </Modal>
    </div>
  );
};

export default App;
