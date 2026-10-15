import { z } from "zod";

export const fetchTopicschema = z.object({
  lastId: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val === "" || val === null ? undefined : val))
    .refine((val) => val === undefined || z.uuidv7().safeParse(val).success, {
      message: "Invalid UUIDv7 format for lastId",
    }),
  direction: z.enum(["next", "prev"]).optional(),
});

export const createTopicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Topic name is required")
    .max(200, "Topic name must be at most 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const updateTopicSchema = z.object({
  id: z.uuidv7(),
  name: z
    .string()
    .trim()
    .min(1, "Topic name is required")
    .max(200, "Topic name must be at most 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const deleteTopicSchema = z.object({
  id: z.uuidv7(),
});

export const fetchTopicByCursorSchema = z.object({
  lastId: z.string().optional(),
});

export type fetchTopicsQuery = z.infer<typeof fetchTopicschema>;

export type CreateTopicInput = z.infer<typeof createTopicSchema>;

export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;

export type DeleteTopicInput = z.infer<typeof deleteTopicSchema>;

export type fetchTopicByCursorQuery = z.infer<typeof fetchTopicByCursorSchema>;
