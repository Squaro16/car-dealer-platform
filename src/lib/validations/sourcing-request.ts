// Validation schema for public sourcing requests with limits to reduce spam.
// Validation schema for public sourcing requests.
import { z } from "zod";

export const sourcingRequestSchema = z.object({
    name: z.string().trim().min(2, "Name must have at least 2 characters").max(120),
    email: z.string().trim().email("Invalid email"),
    phone: z.string().trim().min(8, "Phone must have at least 8 characters").max(32),
    make: z.string().trim().min(1).max(60),
    model: z.string().trim().min(1).max(60),
    yearRange: z.string().trim().max(20).nullable().optional(),
    budget: z
        .union([z.coerce.number().nonnegative(), z.string().trim().max(20)])
        .nullable()
        .optional(),
    color: z.string().trim().max(40).nullable().optional(),
    transmission: z
        .enum(["automatic", "manual", "cvt", "dct"])
        .nullable()
        .optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
    captchaToken: z.string().trim().min(0).optional(),
});

export type SourcingRequestFormValues = z.infer<typeof sourcingRequestSchema>;

