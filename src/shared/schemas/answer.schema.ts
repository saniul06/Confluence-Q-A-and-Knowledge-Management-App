import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.uuidv7(),

  body: z
    .string()
    .trim()
    .min(1, "Answer cannot be empty")
    .max(10_000, "Answer cannot exceed 10,000 characters"),
});

export const acceptAnswerSchema = z.object({
  questionId: z.uuidv7(),
  answerId: z.uuidv7(),
});

export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;

export type AcceptAnswerInput = z.infer<typeof acceptAnswerSchema>;
