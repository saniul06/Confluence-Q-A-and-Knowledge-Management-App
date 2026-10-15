import type { Topic } from "../../../../../../src/shared/types";
import { formatDate } from "../../../utils/helpers";

type TopicTableProps = {
  topics: Topic[];
  loading: boolean;
  deletingId: string;
  status:  boolean;
  onEdit: (topic: Topic) => void;
  onDelete: (id: string) => void;
};

export function TopicTable({
  topics,
  loading,
  deletingId,
  status,
  onEdit,
  onDelete,
}: TopicTableProps) {

  if (loading && topics.length === 0) {
    return <div className="table-loading">Loading topics...</div>;
  }

  if (!loading && topics.length === 0) {
    return (
      <div className="empty-state">
        <h3>No topics yet</h3>
        <p>Create your first topic to start assigning experts.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="topic-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {topics.map((topic) => {
            const deleting = deletingId === topic.id;

            return (
              <tr key={topic.id}>
                <td className="topic-name">{topic.name}</td>

                <td className="topic-description">
                  {topic.description || "—"}
                </td>

                <td>{formatDate(new Date(topic.createdAt).toString())}</td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="button button-small"
                      disabled={status}
                      onClick={() => onEdit(topic)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-small button-danger"
                      disabled={status}
                      onClick={() => onDelete(topic.id)}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}