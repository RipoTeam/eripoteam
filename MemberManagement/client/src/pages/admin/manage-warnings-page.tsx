import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Warning } from "@shared/schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

type CreateWarningData = {
  userId: number;
  reason: string;
};

export default function AdminManageWarningsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect non-admin users
  if (!user?.isAdmin) {
    return <Link href="/" />;
  }

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: allWarnings, isLoading: warningsLoading } = useQuery<Warning[]>({
    queryKey: ["/api/admin/warnings"],
  });

  const form = useForm<CreateWarningData>({
    defaultValues: {
      reason: "",
    }
  });

  const createWarningMutation = useMutation({
    mutationFn: async (data: CreateWarningData) => {
      const res = await apiRequest("POST", "/api/warnings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warnings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/warnings"] });
      toast({
        title: "Success",
        description: "Warning issued successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Manage Warnings</h1>
        <p className="text-muted-foreground">
          Issue warnings to members
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Issue Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createWarningMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue To</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createWarningMutation.isPending}>
                  {createWarningMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Issue Warning
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            {warningsLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : allWarnings?.length === 0 ? (
              <p className="text-muted-foreground">No warnings issued</p>
            ) : (
              <div className="space-y-4">
                {allWarnings?.map((warning) => {
                  const warningUser = users?.find(u => u.id === warning.userId);
                  return (
                    <div
                      key={warning.id}
                      className="p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{warningUser?.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(warning.issuedAt || new Date(), "PPP")}
                        </p>
                      </div>
                      <p className="text-sm">{warning.reason}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}