import { z } from "zod";

/** Shared by the form (browser) and the API route (server). */
export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  subject: z.string().trim().min(3, "Please add a short subject.").max(160),
  message: z.string().trim().min(20, "A little more detail, please (20 characters minimum).").max(5000),
  // Spam protection
  website: z.string().max(500).optional(), // honeypot: real people never fill this in (checked in the API route)
  startedAt: z.number().optional(),      // time the form was rendered
});
export type ContactInput = z.infer<typeof ContactSchema>;
