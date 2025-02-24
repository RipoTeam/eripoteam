import { useQuery } from "@tanstack/react-query";
import { Ban } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Ban as BanIcon, Loader2 } from "lucide-react";

export default function BanList() {
  const { data: bans, isLoading } = useQuery<Ban[]>({
    queryKey: ["/api/bans"],
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  const activeBans = bans?.filter(
    (ban) => ban.expiresAt && new Date(ban.expiresAt) > new Date()
  ) || [];
  const expiredBans = bans?.filter(
    (ban) => !ban.expiresAt || new Date(ban.expiresAt) <= new Date()
  ) || [];

  return (
    <Card className="bans-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BanIcon className="h-5 w-5" />
          Bans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!bans?.length ? (
          <p className="text-muted-foreground">No bans</p>
        ) : (
          <div className="space-y-6">
            {activeBans.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Active Bans</h3>
                <div className="space-y-4">
                  {activeBans.map((ban) => (
                    <BanItem key={ban.id} ban={ban} />
                  ))}
                </div>
              </div>
            )}

            {expiredBans.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Expired Bans</h3>
                <div className="space-y-4">
                  {expiredBans.map((ban) => (
                    <BanItem key={ban.id} ban={ban} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BanItem({ ban }: { ban: Ban }) {
  const isExpired = ban.expiresAt && new Date(ban.expiresAt) <= new Date();

  return (
    <div className={`p-4 rounded-lg border ${isExpired ? 'bg-muted/50' : 'bg-destructive/10'}`}>
      <p className="font-medium">{ban.reason}</p>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Issued on {format(ban.issuedAt || new Date(), "PPP")}</p>
        {ban.expiresAt && <p>Expires on {format(ban.expiresAt, "PPP")}</p>}
      </div>
    </div>
  );
}