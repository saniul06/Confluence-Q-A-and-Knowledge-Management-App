import { z } from "zod";

export const setDefaultFaqSpaceKeySchema = z.object({
  spaceKey: z.string().trim().min(1).max(255),
});

export type SetDefaultFaqSpaceInput = z.infer<
  typeof setDefaultFaqSpaceKeySchema
>;
