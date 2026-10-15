import sql, { migrationRunner } from "@forge/sql";

const CREATE_TOPICS_TABLE = `
  CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(36) NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL
  )
`;

const CREATE_EXPERTS_TABLE = `
  CREATE TABLE IF NOT EXISTS experts (
    id VARCHAR(36) PRIMARY KEY,
    topic_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
  )
`;

const ADD_UNIQUE_EXPERT_ASSIGNMENT = `
CREATE UNIQUE INDEX IF NOT EXISTS uidx_experts_assignment
ON experts (topic_id, account_id);
`;

const CREATE_QUESTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    space_key VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    author_account_id VARCHAR(255) NOT NULL,
    author_display_name TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    assigned_expert_id VARCHAR(36),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (assigned_expert_id) REFERENCES experts(id)
)
`;

const ADD_INDEX_QUESTION_SPACE_STATUS = `
CREATE INDEX IF NOT EXISTS idx_questions_space_status
ON questions (space_key, status);
`;

const CREATE_QUESTION_TOPICS_TABLE = `
  CREATE TABLE IF NOT EXISTS question_topics (
    question_id VARCHAR(36),
    topic_id VARCHAR(36),
    PRIMARY KEY (question_id, topic_id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
)
`;

const CREATE_ANSWER_TABLE = `
  CREATE TABLE IF NOT EXISTS answers (
    id VARCHAR(36) PRIMARY KEY,
    question_id VARCHAR(36) NOT NULL,
    body TEXT NOT NULL,
    author_account_id VARCHAR(255) NOT NULL,
    author_display_name TEXT NOT NULL,
    is_accepted INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    UNIQUE (question_id, author_account_id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
`;

const ADD_INDEX_ANSWERS_UNIQUE = `
CREATE UNIQUE INDEX IF NOT EXISTS uidx_question_author
ON answers (question_id, author_account_id);
`;

const CREATE_CONFIG_TABLE = `
  CREATE TABLE IF NOT EXISTS config (
    config_key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
`;

const CREATE_FAQ_TABLE = `
  CREATE TABLE IF NOT EXISTS faq_pages (
  id VARCHAR(36) PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  answer_id VARCHAR(36) NOT NULL,
  confluence_page_id TEXT NOT NULL,
  confluence_page_url TEXT,
  space_key VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);;
`;

export const applyMigrations = async () => {
  return migrationRunner
    .enqueue("v2_create_topics_table", CREATE_TOPICS_TABLE)
    .enqueue("v2_create_experts_table", CREATE_EXPERTS_TABLE)
    .enqueue(
      "v2_create_unique_experts_topic_account",
      ADD_UNIQUE_EXPERT_ASSIGNMENT,
    )
    .enqueue("v2_create_questions_table", CREATE_QUESTIONS_TABLE)
    .enqueue(
      "v2_create__index_questions_space_status",
      ADD_INDEX_QUESTION_SPACE_STATUS,
    )
    .enqueue("v2_create_question_topics_table", CREATE_QUESTION_TOPICS_TABLE)
    .enqueue("v2_create_answer_table", CREATE_ANSWER_TABLE)
    .enqueue(
      "v2_create_unique_answers_question_author",
      ADD_INDEX_ANSWERS_UNIQUE,
    )
    .enqueue("v2_create_config_table", CREATE_CONFIG_TABLE)
    .enqueue("v2_create_faq_pages_table", CREATE_FAQ_TABLE)
    .run();
};
