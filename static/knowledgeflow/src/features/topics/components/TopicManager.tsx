import { useEffect, useState, useRef } from "react";

import { ErrorMessage } from "../../../components/ErrorMessage";
import { TopicForm } from "./TopicForm";
import { TopicTable } from "./TopicTable";
import { useTopics } from "../hooks/useTopics";
import type {
  CreateTopicInput,
  fetchTopicsQuery,
  UpdateTopicInput,
} from "../../../../../../src/shared/schemas/topic.schema";
import type { Topic } from "../../../../../../src/shared/types";
import { LIMIT } from "../../../../../../src/shared/constants";

export function TopicManager() {
  const { fetch, create, update, remove, topics, total } = useTopics();

  const [deletingId, setDeletingId] = useState<string>("");

  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [direction, setDirection] = useState<"next" | "prev">("next");

  const deletedRef = useRef("");

  const totalPages = Math.ceil(total / LIMIT);

  const loadingStatus =
    fetch.status === "loading" ||
    create.status === "loading" ||
    update.status === "loading" ||
    remove.status === "loading";

  async function loadTopics({
    lastId = "",
    direction = "next",
  }: fetchTopicsQuery) {
    await fetch.request({ lastId, direction });
    if (deletedRef.current) {
      deletedRef.current = "";
    }
  }

  useEffect(() => {
    // 1. Page 1 is always a fresh fetch with no cursors
    if (page === 1) {
      setDirection("next");
      loadTopics({ lastId: "", direction: "next" });
      return;
    }

    // 2. Use deleted item ID as cursor if page became empty, otherwise use boundary ID
    const cursorId = topics.length
      ? direction === "next"
        ? topics[topics.length - 1].id
        : topics[0].id
      : "";

    const lastId = deletedRef.current || cursorId;

    loadTopics({ lastId, direction });
  }, [page]);

  async function handleCreate(input: CreateTopicInput) {
    const topic = await create.request(input);

    if (!topic) {
      return;
    }

    alert("Topic created successfully");

    if (page == 1) {
      fetch.updateState((current) =>
        current
          ? {
              items: [topic, ...current.items].slice(0, LIMIT),
              total: current.total + 1,
            }
          : {
              items: [topic],
              total: 1,
            },
      );
    } else {
      fetch.updateState((current) =>
        current
          ? {
              ...current,
              total: current.total + 1,
            }
          : {
              items: [topic],
              total: 1,
            },
      );
    }

    setFormOpen(false);
  }

  async function handleUpdate(input: UpdateTopicInput) {
    const topic = await update.request(input);

    if (!topic) {
      return;
    }

    fetch.updateState((current) => ({
      total: current.total,
      items: current.items.reduce<Topic[]>((acc, i) => {
        if (i.id === input.id) {
          i = { ...i, ...input };
          acc.push(i);
          return acc;
        }
        acc.push(i);
        return acc;
      }, []),
    }));

    alert("Topic updated successfully");

    setEditingTopic(null);
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);

      const result = await remove.request({ id });

      if (!result) {
        return;
      }

      alert("Topic deleted successfully");

      // Remove deleted item from local state cache
      fetch.updateState((current) => ({
        ...current,
        items: current.items.filter((i) => i.id !== id),
        total: current.total - 1,
      }));

      // If deleting the last item on a page > 1, navigate back
      if (topics.length === 1 && page > 1) {
        deletedRef.current = id;

        const newPage = page - 1;
        setPage(newPage);

        if (newPage === 1) {
          setDirection("next");
        } else {
          setDirection("prev");
        }
      }
    } catch (err) {
      console.error("Failed to delete topic:", err);
    } finally {
      setDeletingId("");
    }
  }

  function handleEdit(topic: Topic) {
    setEditingTopic(topic);
  }

  const formTopic = editingTopic;

  return (
    <section className="topic-manager">
      <div className="topic-header">
        <div>
          <h2>Topics</h2>
          <p className="muted">Manage topics and their descriptions.</p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() => setFormOpen(true)}
        >
          + Create topic
        </button>
      </div>

      {fetch.status === "error" && (
        <ErrorMessage
          message={fetch.error?.message ?? "Failed to load topics."}
          onRetry={() => void loadTopics({ lastId: "", direction: "next" })}
        />
      )}

      <TopicTable
        topics={topics}
        loading={fetch.status === "loading"}
        deletingId={remove.status === "loading" ? deletingId : ""}
        status={loadingStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="pagination">
        <button
          type="button"
          className="button"
          disabled={page === 1 || loadingStatus}
          onClick={() => {
            setPage((current) => current - 1);
            setDirection("prev");
          }}
        >
          ← Previous
        </button>

        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          className="button"
          disabled={
            (page >= totalPages && page !== 1) ||
            (page >= totalPages && page == 1 && total === topics.length) ||
            loadingStatus
          }
          onClick={() => {
            setPage((current) => current + 1);
            setDirection("next");
          }}
        >
          Next →
        </button>
      </div>

      <p className="muted topic-count">
        {total} topic{total === 1 ? "" : "s"} total
      </p>

      {formOpen && (
        <TopicForm
          mode="create"
          submitting={loadingStatus}
          error={create.error?.message}
          onSubmit={handleCreate}
          onCancel={() => {
            setFormOpen(false);
            create.resetError();
          }}
        />
      )}

      {formTopic && (
        <TopicForm
          mode="edit"
          topic={formTopic}
          submitting={loadingStatus}
          error={update.error?.message}
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditingTopic(null);
            update.resetError();
          }}
        />
      )}
    </section>
  );
}
