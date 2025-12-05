import { z } from "zod";

export const expenseSchema = z.object({
    vehicleId: z.string().uuid().optional(), // Optional if general expense, but for now we focus on vehicle
    amount: z.string().min(1, "Amount is required"), // Validate as string, convert to decimal
    category: z.enum(["repair", "maintenance", "cleaning", "marketing", "admin", "other"]),
    description: z.string().min(1, "Description is required"),
    date: z.string().optional(), // Date string
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
