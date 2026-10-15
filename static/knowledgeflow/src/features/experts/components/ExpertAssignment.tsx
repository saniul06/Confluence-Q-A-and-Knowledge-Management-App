import { useEffect, useState } from "react";
import { useTopics } from "../../topics/hooks/useTopics";
import { useExperts } from "../hooks/useExperts";
import type {
  ConfluenceUser,
  Expert,
  Topic,
} from "../../../../../../src/shared/types";
import { LIMIT } from "../../../../../../src/shared/constants";
import "./ExpertAssignment.css";

export function ExpertAssignment() {
  const topicsRequest = useTopics();
  const expertsRequest = useExperts();

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const experts = (expertsRequest.fetch.data ?? []) as Expert[];

  const [topics, setTopics] = useState<Topic[]>([]);

  const [users, setUsers] = useState<ConfluenceUser[]>([]);

  const [selectedUser, setSelectedUser] = useState<ConfluenceUser | null>(null);

  async function fetchAllUsers() {
    let allUsers = [] as ConfluenceUser[];
    let currentStart = 0;

    try {
      while (true) {
        const batch = (await expertsRequest.findUsers.request({
          start: currentStart,
        })) as ConfluenceUser[];

        allUsers = [...allUsers, ...batch];

        if (!batch || !batch.length || batch.length < LIMIT) {
          break;
        }

        currentStart += LIMIT;
      }

      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to recursively fetch all users:", error);
      throw error;
    }
  }

  async function fetchAllTopics() {
    const allTopics: Topic[] = [];
    let lastId = "";

    while (true) {
      const batch = (await topicsRequest.cursor.request({ lastId })) as Topic[];

      allTopics.push(...batch);

      if (!batch || !batch.length || batch.length < LIMIT) {
        break;
      }

      lastId = batch[batch.length - 1].id;
    }

    setTopics(allTopics);
  }

  useEffect(() => {
    fetchAllTopics();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedTopicId)
      expertsRequest.fetch.request({ topicId: selectedTopicId });
  }, [selectedTopicId]);

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId || null);
    setSelectedUser(null);
  };

  const handleAssign = async () => {
    if (!selectedTopicId || !selectedUser) {
      return;
    }

    const expert = await expertsRequest.assign.request({
      topicId: selectedTopicId,
      accountId: selectedUser.accountId,
      displayName: selectedUser.displayName,
    });

    if (!expert) {
      return;
    }

    alert("Expert assigned successfully");

    expertsRequest.fetch.updateState((current) =>
      current ? [...current, expert] : [expert],
    );
  };

  const handleRemove = async (id: string) => {
    const result = await expertsRequest.remove.request({ id });

    if (!result) {
      return;
    }

    alert("Expert removed successfully");

    expertsRequest.fetch.updateState((current) =>
      current?.filter((expert) => expert.id !== id),
    );
  };

  return (
    <section className="expert-assignment">
      <div className="expert-header">
        <div>
          <h2>Expert Assignments</h2>
          <p className="expert-description">
            Assign Confluence users as experts for specific topics.
          </p>
        </div>
      </div>

      <div className="expert-section">
        <div>
          <label className="form-label" htmlFor="expert-topic">
            Topic
          </label>

          <select
            id="expert-topic"
            className="form-select"
            value={selectedTopicId ?? ""}
            onChange={(event) => handleTopicChange(event.target.value)}
          >
            <option value="">Select a topic</option>

            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="button"
            className="button button-small"
            onClick={fetchAllTopics}
            disabled={topicsRequest.cursor.status === "loading"}
          >
            Fetch Latest Topic
          </button>
        </div>
      </div>

      {selectedTopicId && (
        <>
          <div className="expert-section">
            <div className="section-heading">
              <h3>Assigned Experts</h3>
              <span className="expert-count">{experts.length}</span>
            </div>

            {experts.length === 0 ? (
              <div className="empty-state">
                {expertsRequest.fetch.status === "loading"
                  ? "Loading Experts..."
                  : "No experts assigned to this topic."}
              </div>
            ) : (
              <div className="expert-list">
                {expertsRequest.fetch.status === "loading" ? (
                  <div className="empty-state">Loading Experts...</div>
                ) : (
                  experts.map((expert) => (
                    <div className="expert-row" key={expert.id}>
                      <div className="expert-info">
                        <span className="expert-name">
                          {expert.displayName}
                        </span>

                        <span className="expert-account">
                          {expert.accountId}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="button button-danger"
                        disabled={
                          expertsRequest.remove.status === "loading" ||
                          expertsRequest.assign.status === "loading"
                        }
                        onClick={() => handleRemove(expert.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="expert-section">
            <h3>Add Expert</h3>

            <div className="assign-form">
              <div className="assign-field">
                <label className="form-label" htmlFor="expert-user">
                  Confluence User
                </label>

                <select
                  id="expert-user"
                  className="form-select"
                  value={JSON.stringify(selectedUser)}
                  onChange={(event) =>
                    setSelectedUser(JSON.parse(event.target.value))
                  }
                  disabled={expertsRequest.findUsers.status === "loading"}
                >
                  <option value="">Select a user</option>

                  {users.map((user) => (
                    <option key={user.accountId} value={JSON.stringify(user)}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="button button-primary"
                disabled={
                  !selectedUser || expertsRequest.assign.status === "loading"
                }
                onClick={handleAssign}
              >
                {expertsRequest.assign.status === "loading"
                  ? "Assigning..."
                  : "Assign Expert"}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
