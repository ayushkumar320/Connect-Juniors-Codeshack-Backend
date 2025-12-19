import {z} from "zod";

// Create Answer Schema
const createAnswerSchema = z.object({
    content: z
        .string()
        .min(20, "Answer must be at least 20 characters")
        .max(10000),
    doubtId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doubt ID"),
});

// Update Answer Schema
const updateAnswerSchema = z.object({
    content: z.string().min(20).max(10000),
});

export {createAnswerSchema, updateAnswerSchema};
