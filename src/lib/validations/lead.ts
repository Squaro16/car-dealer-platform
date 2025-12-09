// Validation schemas for public lead capture and sell requests with size limits.
import { z } from "zod";

export const leadSchema = z.object({
    name: z.string().trim().min(2, "Name must have at least 2 characters").max(120),
    phone: z.string().trim().min(8, "Phone must have at least 8 characters").max(32),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
    message: z.string().trim().min(1, "Message is required").max(1000),
    vehicleId: z.string().uuid("Vehicle is required"),
    captchaToken: z.string().trim().min(0).optional(),
});

export const sellRequestSchema = z.object({
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
    make: z.string().trim().min(1).max(60),
    model: z.string().trim().min(1).max(60),
    vin: z.string().trim().min(5).max(32),
    mileage: z.coerce.number().int().nonnegative(),
    condition: z.string().trim().min(2).max(40),
    price: z.union([z.coerce.number().nonnegative(), z.string().trim().max(20)]).optional(),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email("Invalid email"),
    phone: z.string().trim().min(8).max(32),
    captchaToken: z.string().trim().min(0).optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
export type SellRequestFormValues = z.infer<typeof sellRequestSchema>;

