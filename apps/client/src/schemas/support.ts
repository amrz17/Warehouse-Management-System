import { z } from "zod";

export const supportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type SupportFormValues = z.infer<typeof supportSchema>;
