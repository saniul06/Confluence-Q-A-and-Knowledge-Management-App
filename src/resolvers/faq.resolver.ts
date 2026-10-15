import { validatePayload, withResponse } from "../utils/helpers";
import { ResolverGroup } from "../shared/types";
import { setDefaultFaqSpaceKeySchema } from "../shared/schemas/config.schema";
import { ConfigService } from "../services/config.service";
import { publishFaqSchema } from "../shared/schemas/faq.schema";
import { FaqService } from "../services/faq.service";

export function faqResolvers(
  configService: ConfigService,
  faqService: FaqService,
): ResolverGroup<
  | "getDefaultFaqSpaceKey"
  | "setDefaultFaqSpaceKey"
  | "publishFaq"
  | "getAllSpaceKeys"
> {
  return {
    getDefaultFaqSpaceKey: withResponse(async (request) => {
      return configService.getDefaultFaqSpaceKey();
    }),
    getAllSpaceKeys: withResponse(async (request) => {
      return configService.getAllKeys();
    }),
    setDefaultFaqSpaceKey: withResponse(async (request) => {
      const input = validatePayload(
        setDefaultFaqSpaceKeySchema,
        request.payload,
      );

      return configService.setDefaultFaqSpaceKey(input);
    }),
    publishFaq: withResponse(async (request) => {
      const input = validatePayload(publishFaqSchema, request.payload);

      return faqService.publish({
        ...input,
        actorAccountId: request.context.accountId,
      });
    }),
  };
}
