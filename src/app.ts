import { TopicService } from "./services/topic.service";
import { ForgeTopicRepository } from "./repositories/topic/forge-topic.repository";
import { ForgeConfluenceGateway } from "./repositories/confluence/forge-conflucence.repository";
import { ForgeExpertRepository } from "./repositories/expert/forge-expert.repository";
import { ExpertService } from "./services/expert.service";
import { QuestionService } from "./services/question.service";
import { ForgeQuestionRepository } from "./repositories/question/forge-question.repository";
import { ForgeQuestionTopicRepository } from "./repositories/question/forge-question-topic.repository";
import { ForgeAnswerRepository } from "./repositories/question/forge-answer.repository";
import { ConfluenceService } from "./services/confluence.service";
import { AnswerService } from "./services/answer.service";
import { FaqService } from "./services/faq.service";
import { ForgeFaqPageRepository } from "./repositories/faq/forge-faq.repository";
import { ForgeConfluenceSpaceGateway } from "./repositories/confluence/confluence-space-gateway";
import { ForgeConfluencePageGateway } from "./repositories/confluence/confluence-page-gateway";
import { ForgeConfigRepository } from "./repositories/config/forge-config.repository";
import { ConfigService } from "./services/config.service";
import { ForgeDashboardRepository } from "./repositories/dashboard/forge-dashboard.repository";
import { DashboardService } from "./services/dashboard.service";
import { NotificationService } from "./services/notification.service";

export function createApp() {
  const topicRepository = new ForgeTopicRepository();

  const questionTopicRepository = new ForgeQuestionTopicRepository();

  const expertRepository = new ForgeExpertRepository();

  const topicService = new TopicService(
    topicRepository,
    questionTopicRepository,
    expertRepository,
  );

  const confluenceGateway = new ForgeConfluenceGateway();

  const confluenceService = new ConfluenceService(confluenceGateway);

  const expertService = new ExpertService(expertRepository, confluenceService);

  const questionRepository = new ForgeQuestionRepository();

  const answerRepository = new ForgeAnswerRepository();

  const questionService = new QuestionService(
    questionRepository,
    questionTopicRepository,
    expertService,
    confluenceService,
    answerRepository,
    topicService,
  );

  const answerService = new AnswerService(
    answerRepository,
    questionRepository,
    confluenceGateway,
  );

  const faqRepository = new ForgeFaqPageRepository();

  const configRepository = new ForgeConfigRepository();

  const confluenceSpaceGateway = new ForgeConfluenceSpaceGateway();

  const confluencePageGateway = new ForgeConfluencePageGateway();

  const faqService = new FaqService(
    questionRepository,
    faqRepository,
    configRepository,
    confluenceSpaceGateway,
    confluencePageGateway,
    confluenceService,
  );

  const configService = new ConfigService(
    configRepository,
    confluenceSpaceGateway,
  );

  const dashboardRepository = new ForgeDashboardRepository();
  const dashboardService = new DashboardService(dashboardRepository);

  const notificationService = new NotificationService();

  return {
    topicService,
    expertService,
    questionService,
    answerService,
    confluenceService,
    faqService,
    configService,
    dashboardService,
    notificationService,
  };
}
