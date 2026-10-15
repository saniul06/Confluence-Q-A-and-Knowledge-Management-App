import { z } from "zod";

export const publishFaqSchema = z.object({
  questionId: z.uuidv7(),
});

export type PublishFaqInput = z.infer<typeof publishFaqSchema>;
