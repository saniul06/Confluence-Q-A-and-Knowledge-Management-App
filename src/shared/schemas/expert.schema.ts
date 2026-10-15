import { z } from "zod";

export const fetchExpertsSchema = z.object({
  topicId: z.uuidv7(),
});

export const searchUsersSchema = z.object({
  start: z.number().int().min(0),
});

export const assignExpertSchema = z.object({
  topicId: z.uuidv7(),
  accountId: z.string().trim().min(1).max(255),
  displayName: z.string().trim().min(1).max(255),
});

export const removeExpertSchema = z.object({
  id: z.uuidv7(),
});

export type FetchExpertQuery = z.infer<typeof fetchExpertsSchema>;

export type SearchUsersQuery = z.infer<typeof searchUsersSchema>;

export type AssignExpertInput = z.infer<typeof assignExpertSchema>;

export type RemoveExpertInput = z.infer<typeof removeExpertSchema>;
