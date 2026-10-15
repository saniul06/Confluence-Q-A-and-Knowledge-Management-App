type AppProps = {
  context: ForgeAppContext;
};

import { AdminPage } from "./pages/Admin/AdminPage";
import type { ForgeAppContext } from "./types/forge.type";
import { DashboardPage } from "./pages/dashboard/dashboard";
import QuestionBoardPage from "./pages/space-qa-board/QuestionBoardPage";
import { useExpertNotifications } from "./features/notification/notification";

export default function App({ context }: AppProps) {
  const spaceKey = context?.extension?.space?.key;

  useExpertNotifications()

  switch (context.moduleKey) {
    case "knowledgeflow-space-page":
      return <QuestionBoardPage spaceKey={spaceKey as string} />;

    case "knowledgeflow-admin-page":
      return <AdminPage />;

    case "knowledgeflow-dashboard":
      return <DashboardPage />;

    default:
      return (
        <div role="alert">
          Unknown KnowledgeFlow module: {context.moduleKey}
        </div>
      );
  }
}
