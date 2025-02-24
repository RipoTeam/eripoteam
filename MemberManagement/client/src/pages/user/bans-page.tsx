import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout";
import BanList from "@/components/ban-list";

export default function UserBansPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bans</h1>
        <p className="text-muted-foreground">
          View your ban history
        </p>
      </div>

      <BanList />
    </Layout>
  );
}
