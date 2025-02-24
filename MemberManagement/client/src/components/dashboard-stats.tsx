import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, Warning, Ban } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function DashboardStats() {
  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({ 
    queryKey: ["/api/tasks"]
  });
  
  const { data: warnings, isLoading: warningsLoading } = useQuery<Warning[]>({
    queryKey: ["/api/warnings"]
  });
  
  const { data: bans, isLoading: bansLoading } = useQuery<Ban[]>({
    queryKey: ["/api/bans"]
  });

  if (tasksLoading || warningsLoading || bansLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  const stats = [
    {
      title: "Active Tasks",
      value: tasks?.filter(t => !t.completed).length || 0,
    },
    {
      title: "Completed Tasks",
      value: tasks?.filter(t => t.completed).length || 0,
    },
    {
      title: "Warnings",
      value: warnings?.length || 0,
    },
    {
      title: "Active Bans",
      value: bans?.filter(b => new Date(b.expiresAt) > new Date()).length || 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
