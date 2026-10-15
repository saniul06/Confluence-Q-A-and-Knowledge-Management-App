import { makeResolver } from "@forge/resolver";
import { createApp } from "./app";
import { topicResolvers } from "./resolvers/topic.resolver";
import { expertResolvers } from "./resolvers/expert.resolver";
import { questionResolvers } from "./resolvers/question.resolver";
import { answerResolvers } from "./resolvers/answer.resolver";
import { confluenceResolvers } from "./resolvers/confluence.resolver";
import { faqResolvers } from "./resolvers/faq.resolver";
import { dashboardResolvers } from "./resolvers/dashboard.resolver";
import { notificationResolvers } from "./resolvers/notification.resolver";

const app = createApp();

export const handler = makeResolver({
  ...topicResolvers(app.topicService),
  ...expertResolvers(app.expertService),
  ...questionResolvers(app.questionService),
  ...answerResolvers(app.answerService),
  ...confluenceResolvers(app.confluenceService),
  ...faqResolvers(app.configService, app.faqService),
  ...dashboardResolvers(app.dashboardService),
  ...notificationResolvers(app.notificationService),
});
