import { useQuery } from "@tanstack/react-query";
import { Warning } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function WarningList() {
  const { data: warnings, isLoading } = useQuery<Warning[]>({
    queryKey: ["/api/warnings"],
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <Card className="warnings-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {warnings?.length === 0 ? (
          <p className="text-muted-foreground">No warnings</p>
        ) : (
          <div className="space-y-4">
            {warnings?.map((warning) => (
              <div
                key={warning.id}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <p className="font-medium">{warning.reason}</p>
                <p className="text-sm text-muted-foreground">
                  Issued on {format(warning.issuedAt || new Date(), "PPP")}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}