import { ExpertAssignment } from "../../features/experts/components/ExpertAssignment";
import { DefaultFaqSpaceSetting } from "../../features/faq/components/DefaultFaqSpaceSetting";
import { TopicManager } from "../../features/topics/components/TopicManager";

export function AdminPage() {
  return (
    <main className="admin-page">
      <TopicManager />
      <ExpertAssignment />
      <DefaultFaqSpaceSetting />
    </main>
  );
}
