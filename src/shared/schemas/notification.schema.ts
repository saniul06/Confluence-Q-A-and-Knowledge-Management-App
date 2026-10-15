import { z } from "zod";

export const markNotificationReadSchema = z.object({
  id: z.string(),
});

export const listNotificationSchema = z.object({
  unreadOnly: z.boolean().optional(),
  limit: z.int().min(1).max(50)
});

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;

export type ListNotificationInput = z.infer<typeof listNotificationSchema>;
