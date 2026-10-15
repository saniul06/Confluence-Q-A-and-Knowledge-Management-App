import type {
  AcceptAnswerInput,
  CreateAnswerInput,
} from "./schemas/answer.schema";
import type { SetDefaultFaqSpaceInput } from "./schemas/config.schema";
import type {
  AssignExpertInput,
  FetchExpertQuery,
  RemoveExpertInput,
  SearchUsersQuery,
} from "./schemas/expert.schema";
import type { PublishFaqInput } from "./schemas/faq.schema";
import type {
  CreateQuestionInput,
  GetQuestionInput,
  ListQuestionsInput,
} from "./schemas/question.schemas";
import type {
  CreateTopicInput,
  UpdateTopicInput,
  DeleteTopicInput,
  fetchTopicsQuery,
  fetchTopicByCursorQuery,
} from "./schemas/topic.schema";
import type { Answer } from "./types/answer.type";
import type { DashboardData } from "./types/dashboard.type";
import type {
  PaginatedQuestions,
  Question,
  QuestionDetails,
} from "./types/question.type";

export type Topic = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type PaginatedTopics = {
  items: Topic[];
  total: number;
};

export type Expert = {
  id: string;
  topicId: string;
  accountId: string;
  displayName: string;
  createdAt: string;
};

export type ConfluenceUser = {
  accountId: string;
  displayName: string;
};

export type CheckUser = {
  accountId: string;
  isAdmin: boolean;
}

export type ConfluenceUserCheck = ConfluenceUser & {isAdmin: boolean}

export type ConfluenceUserSearchResponse = {
  results: Array<{
    user: {
      accountId: string;
      displayName: string;
    };
  }>;
};


export type PublishedFaq = {
  confluencePageId: string;
  confluencePageUrl: string | null;
  spaceKey: string;
  title: string;
};

export type Defs = {
  createTopic: (args: CreateTopicInput) => Promise<ApiResponse<Topic>>;

  fetchTopics: (
    args: fetchTopicsQuery,
  ) => Promise<ApiResponse<PaginatedTopics>>;

  fetchTopicsByCursor: (
    args: fetchTopicByCursorQuery,
  ) => Promise<ApiResponse<Topic[]>>;

  updateTopic: (args: UpdateTopicInput) => Promise<ApiResponse<boolean>>;

  deleteTopic: (args: DeleteTopicInput) => Promise<ApiResponse<boolean>>;

  fetchExperts: (input: FetchExpertQuery) => Promise<ApiResponse<Expert[]>>;

  findUsers: (
    input: SearchUsersQuery,
  ) => Promise<ApiResponse<ConfluenceUser[]>>;

  assignExpert: (input: AssignExpertInput) => Promise<ApiResponse<Expert>>;

  removeExpert: (input: RemoveExpertInput) => Promise<ApiResponse<boolean>>;

  listQuestions: (
    input: ListQuestionsInput,
  ) => Promise<ApiResponse<PaginatedQuestions>>;

  createQuestion: (
    input: CreateQuestionInput,
  ) => Promise<ApiResponse<Question>>;

  getQuestion: (
    input: GetQuestionInput,
  ) => Promise<ApiResponse<QuestionDetails>>;

  createAnswer: (input: CreateAnswerInput) => Promise<ApiResponse<Answer>>;

  acceptAnswer: (input: AcceptAnswerInput) => Promise<ApiResponse<boolean>>;

  getCurrentUser: () => Promise<ApiResponse<CheckUser>>;

  getDefaultFaqSpaceKey: () => Promise<ApiResponse<string | null>>;

  getAllSpaceKeys: () => Promise<ApiResponse<string[]>>;

  setDefaultFaqSpaceKey: (
    input: SetDefaultFaqSpaceInput,
  ) => Promise<ApiResponse<boolean>>;

  publishFaq: (input: PublishFaqInput) => Promise<ApiResponse<PublishedFaq>>;

  getDashboardData: () => Promise<ApiResponse<DashboardData>>;

  getExpertNotificationToken: () => Promise<ApiResponse<{token: string}>>;
};

export type ResolverGroup<K extends keyof Defs> = {
  [P in K]: (request: {
    context: any;
    payload: Parameters<Defs[P]>[0];
  }) => ReturnType<Defs[P]>;
};

export type ResolverContext = {
  accountId: string;
};

export type Input<K extends keyof Defs> = Parameters<Defs[K]>[0];

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "UNPROCESSABLE_ENTITY"
  | "INTERNAL_ERROR";

export type ApiError = {
  message?: string;
  code?: ErrorCode;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiError;
    };