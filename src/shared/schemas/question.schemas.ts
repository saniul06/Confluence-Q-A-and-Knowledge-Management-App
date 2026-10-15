import { z } from "zod";

export const createQuestionSchema = z.object({
  spaceKey: z.string().trim().min(1, "Space key is required").max(255),

  title: z
    .string()
    .trim()
    .min(1, "Question title is required")
    .max(200, "Question title cannot exceed 200 characters"),

  body: z
    .string()
    .trim()
    .max(10_000, "Question body cannot exceed 10,000 characters")
    .optional(),

  topicIds: z.array(z.string().uuid()).min(1, "Select at least one topic"),
});

export const listQuestionsSchema = z.object({
  spaceKey: z.string().trim().min(1).max(255),

  status: z.enum(["open", "answered", "faq_published"]).optional(),

  topicId: z.uuidv7().optional(),

  cursor: z
    .object({
      lastId: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val === "" || val === null ? undefined : val))
        .refine(
          (val) => val === undefined || z.uuidv7().safeParse(val).success,
          { message: "Invalid UUIDv7 format for lastId" },
        ),

      direction: z.enum(["next", "prev"]).optional().default("next"),
    })
    .optional(),
});

export const getQuestionSchema = z.object({ id: z.uuidv7() });

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export type ListQuestionsInput = z.infer<typeof listQuestionsSchema>;

export type GetQuestionInput = z.infer<typeof getQuestionSchema>;
