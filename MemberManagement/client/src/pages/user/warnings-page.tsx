import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/layout";
import WarningList from "@/components/warning-list";

export default function UserWarningsPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Warnings</h1>
        <p className="text-muted-foreground">
          View your warning history
        </p>
      </div>

      <WarningList />
    </Layout>
  );
}
