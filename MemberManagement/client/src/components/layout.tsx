import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Users,
  ListTodo,
  AlertTriangle,
  Ban,
  Settings,
  LogOut,
  LayoutDashboard,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { OnboardingTutorial } from "./onboarding-tutorial";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const navigationItems = user?.isAdmin ? [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "Users", icon: Users },
    { href: "/manage-tasks", label: "Manage Tasks", icon: ListTodo },
    { href: "/manage-warnings", label: "Manage Warnings", icon: AlertTriangle },
    { href: "/manage-bans", label: "Manage Bans", icon: Ban },
    { href: "/add-user", label: "Add User", icon: UserPlus },
  ] : [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "My Tasks", icon: ListTodo },
    { href: "/warnings", label: "My Warnings", icon: AlertTriangle },
    { href: "/bans", label: "My Bans", icon: Ban },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        <div className="p-6 dashboard-welcome">
          <h1 className="text-xl font-bold">Ripo Team</h1>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 transform hover:scale-105",
                      location === item.href 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
              onClick={() => window.location.href = 'https://dev-ripoteam.pantheonsite.io/'}
            >
              <ExternalLink className="h-4 w-4" />
              Back to ChatBook
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-sidebar-foreground/70">
                {user?.isAdmin ? "Administrator" : user?.isMod ? "Moderator" : "Member"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="settings-section transition-all duration-200 hover:rotate-45"
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Button 
            variant="secondary" 
            className="w-full transition-all duration-200 transform active:scale-95"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />
    </div>
  );
}