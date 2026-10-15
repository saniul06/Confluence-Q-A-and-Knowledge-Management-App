import { useEffect, useReducer, useRef, useState } from "react";

import { useQuestions } from "../hooks/useQuestions";
import { useTopics } from "../../topics/hooks/useTopics";

import { QuestionFilters } from "./QuestionFilters";
import { QuestionList } from "./QuestionList";
import { QuestionForm } from "./QuestionForm";
import { QuestionDetails } from "./QuestionDetails";
import {
  initialQuestionBoardState,
  questionBoardReducer,
} from "../../../state/questionBoard/questionBoard.reducer";
import { PageHeader } from "./PageHeader";
import "./QuestionBoard.css";
import type {
  QuestionCursor,
  QuestionDetails as QuestionDetailsType,
  QuestionListItem,
} from "../../../../../../src/shared/types/question.type";
import type { Topic } from "../../../../../../src/shared/types";
import { LIMIT, QUESTION_STATUS } from "../../../../../../src/shared/constants";

type QuestionBoardProps = {
  spaceKey: string;
};

export function QuestionBoard({ spaceKey }: QuestionBoardProps) {
  const [state, dispatch] = useReducer(
    questionBoardReducer,
    initialQuestionBoardState,
  );

  const [questions, setQuestions] = useState<QuestionListItem[]>([]);

  const questionsRequest = useQuestions();

  const topicsRequest = useTopics();

  const [topics, setTopics] = useState<Topic[]>([]);

  const requestVersionRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  async function fetchQuestions(
    cursor: QuestionCursor | undefined,
    requestVersion: number,
    mode: "replace" | "append",
  ) {
    try {
      const result = await questionsRequest.fetch.request({
        spaceKey,
        status: state.status === "all" ? undefined : state.status,
        topicId: state.topicId ?? undefined,
        ...(cursor ? { cursor } : {}),
      });

      // Ignore responses belonging to old filters.
      if (requestVersion !== requestVersionRef.current) {
        return;
      }

      if (result) {
        if (mode === "replace") {
          setQuestions(result.items);
        } else {
          setQuestions((current) => [...current, ...result.items]);
        }

        // Update next-page cursor here if your API returns one.
      }
    } finally {
      if (requestVersion === requestVersionRef.current) {
        if (mode === "replace") {
          setIsLoadingInitial(false);
        } else {
          loadingMoreRef.current = false;
        }
      }
    }
  }

  useEffect(() => {
    fetchAllTopics();
  }, []);

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
    if (!spaceKey) {
      setQuestions([]);
      return;
    }

    // Every filter change invalidates all previous requests.
    const requestVersion = ++requestVersionRef.current;

    loadingMoreRef.current = false;
    setQuestions([]);
    setIsLoadingInitial(true);

    void fetchQuestions(undefined, requestVersion, "replace");

    return () => {
      // Invalidate this effect's requests on cleanup.
      if (requestVersionRef.current === requestVersion) {
        requestVersionRef.current++;
      }
    };
  }, [spaceKey, state.status, state.topicId]);

  function handleLoadMore(cursor?: QuestionCursor) {
    if (loadingMoreRef.current || isLoadingInitial) {
      return;
    }

    loadingMoreRef.current = true;

    void fetchQuestions(cursor, requestVersionRef.current, "append");
  }

  if (!spaceKey) {
    return null;
  }

  if (state.selectedQuestionId) {
    return (
      <QuestionDetails
        questionId={state.selectedQuestionId}
        onAcceptAnswer={onAcceptAnswer}
        onFaqCreated={onFaqCreated}
        onBack={() =>
          dispatch({
            type: "CLOSE_QUESTION",
          })
        }
      />
    );
  }

  function onCreated(questionListItem: QuestionListItem) {
    alert("Question created successfully");
    dispatch({
      type: "CLOSE_ASK_FORM",
    });
    const matchesCurrentFilter =
      state.status === "all" || state.status === questionListItem.status;

    const matchesTopic =
      !state.topicId ||
      questionListItem.topics.some((topic) => topic.id === state.topicId);

    if (matchesCurrentFilter && matchesTopic) {
      setQuestions((questions) => [questionListItem, ...questions]);
    }
  }

  function onAcceptAnswer(question: QuestionDetailsType) {
    if (state.status !== "all") {
      setQuestions((current) => current.filter((i) => i.id !== question.id));
      return;
    }

    setQuestions((current) =>
      current.map((i) => {
        if (i.id === question.id) {
          return { ...i, status: QUESTION_STATUS.answered };
        }
        return i;
      }),
    );
  }

  function onFaqCreated(questionId: string) {
    setQuestions((current) =>
      current.map((i) => {
        if (i.id === questionId) {
          return { ...i, status: QUESTION_STATUS.faq_published };
        }
        return i;
      }),
    );
  }

  return (
    <section className="question-board">
      <PageHeader
        onAskQuestion={() => {
          dispatch({ type: "OPEN_ASK_FORM" });
        }}
      />

      <QuestionFilters
        status={state.status}
        topicId={state.topicId}
        topics={topics}
        onStatusChange={(status) =>
          dispatch({
            type: "SET_STATUS",
            payload: status,
          })
        }
        onTopicChange={(topicId) =>
          dispatch({
            type: "SET_TOPIC",
            payload: topicId,
          })
        }
      />

      <QuestionList
        request={questionsRequest.fetch}
        questions={questions}
        onSelect={(questionId) =>
          dispatch({
            type: "OPEN_QUESTION",
            payload: questionId,
          })
        }
        handleLoadMore={handleLoadMore}
      />

      {state.isAskFormOpen && (
        <QuestionForm
          spaceKey={spaceKey}
          topics={topics}
          createQuestion={questionsRequest.create}
          onCreated={onCreated}
          onClose={() =>
            dispatch({
              type: "CLOSE_ASK_FORM",
            })
          }
        />
      )}
    </section>
  );
}
