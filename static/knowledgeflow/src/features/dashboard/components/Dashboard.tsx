import { useEffect } from "react";
import { router } from "@forge/bridge";
import { useDashboard } from "../hooks/useDashboard";
import "./Dashboard.css";

export function Dashboard() {
  const dashboardRequest = useDashboard();
  const data = dashboardRequest.fetch.data || null;
  const loading = dashboardRequest.fetch.status === "loading";
  const error = dashboardRequest.fetch?.error?.message || "";

  useEffect(() => {
    async function loadDashboard() {
      await dashboardRequest.fetch.request();
    }
    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="dashboard-page">
        <p className="dashboard-message">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error" role="alert">
          {error}
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="dashboard-page">
        <p className="dashboard-message">No dashboard data available.</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">KnowledgeFlow Dashboard</h1>
      </header>

      <section className="dashboard-section" aria-label="Question statistics">
        <div className="dashboard-stats">
          <StatCard title="Total questions" count={data.stats.totalQuestions} />
          <StatCard title="Open questions" count={data.stats.openQuestions} />
          <StatCard
            title="Answered questions"
            count={data.stats.answeredQuestions}
          />
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Recent questions</h2>

        {data.recentQuestions.length === 0 ? (
          <p>No questions have been created yet.</p>
        ) : (
          <ul className="dashboard-list">
            {data.recentQuestions.map((question) => (
              <RecentQuestionRow key={question.id} question={question} />
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Top 5 experts</h2>

        {data.topExperts.length === 0 ? (
          <p>No expert answers have been recorded yet.</p>
        ) : (
          <ol className="dashboard-list">
            {data.topExperts.map((expert) => (
              <li key={expert.accountId}>
                <span>{expert.displayName}</span>
                <span>{expert.answerCount} answers</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <article className="stat-card">
      <h2>{title}</h2>
      <p>{count.toLocaleString()}</p>
    </article>
  );
}

function RecentQuestionRow({ question }: { question: any }) {
  async function openQuestionSpace() {
    await router.navigate({
      target: "module",
      moduleKey: "knowledgeflow-space-page",
      spaceKey: question.spaceKey,
    });
  }

  return (
    <li>
      <button type="button" onClick={() => void openQuestionSpace()}>
        {question.title}
      </button>

      <div>
        <span>{question.spaceKey}</span>
        {" · "}
        <span>{question.status.replace("_", " ")}</span>
        {" · "}
        <span>{question.authorDisplayName}</span>
      </div>
    </li>
  );
}
