import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout";
import DashboardStats from "@/components/dashboard-stats";
import TaskList from "@/components/task-list";
import WarningList from "@/components/warning-list";
import BanList from "@/components/ban-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import confetti from 'canvas-confetti';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    // Trigger confetti effect on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <Layout>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Member Portal</h1>
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Welcome back, {user?.username}
          </h1>
          <p className="text-muted-foreground">
            {user?.isAdmin
              ? "Manage your members, tasks, warnings, and bans from your admin dashboard."
              : "View your tasks, warnings, and bans from your personal dashboard."}
          </p>
        </div>

        <div className="mb-8">
          <DashboardStats />
        </div>

        {user?.isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <p className="text-muted-foreground">
                  Visit the respective pages to manage users, tasks, warnings, and bans.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TaskList />
              <WarningList />
            </div>
            <div>
              <BanList />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}