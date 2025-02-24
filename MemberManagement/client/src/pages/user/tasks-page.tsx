import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout";
import TaskList from "@/components/task-list";

export default function UserTasksPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">
          View and manage your assigned tasks
        </p>
      </div>

      <TaskList />
    </Layout>
  );
}
