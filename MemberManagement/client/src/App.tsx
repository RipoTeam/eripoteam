import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import AdminUsersPage from "@/pages/admin/users-page";
import AdminManageTasksPage from "@/pages/admin/manage-tasks-page";
import AdminManageWarningsPage from "@/pages/admin/manage-warnings-page";
import AdminManageBansPage from "@/pages/admin/manage-bans-page";
import AdminAddUserPage from "@/pages/admin/add-user-page";
import UserTasksPage from "@/pages/user/tasks-page";
import UserWarningsPage from "@/pages/user/warnings-page";
import UserBansPage from "@/pages/user/bans-page";
import SettingsPage from "@/pages/settings-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />

      {/* Admin Routes */}
      <ProtectedRoute path="/users" component={AdminUsersPage} />
      <ProtectedRoute path="/manage-tasks" component={AdminManageTasksPage} />
      <ProtectedRoute path="/manage-warnings" component={AdminManageWarningsPage} />
      <ProtectedRoute path="/manage-bans" component={AdminManageBansPage} />
      <ProtectedRoute path="/add-user" component={AdminAddUserPage} />

      {/* User Routes */}
      <ProtectedRoute path="/tasks" component={UserTasksPage} />
      <ProtectedRoute path="/warnings" component={UserWarningsPage} />
      <ProtectedRoute path="/bans" component={UserBansPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;