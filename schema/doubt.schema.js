import {z} from "zod";

// Create Doubt Schema
const createDoubtSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(200),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(5000),
    tags: z.array(z.string()).min(1, "At least one tag is required").max(5),
});

// Update Doubt Schema
const updateDoubtSchema = z.object({
    title: z.string().min(10).max(200).optional(),
    description: z.string().min(20).max(5000).optional(),
    tags: z.array(z.string()).min(1).max(5).optional(),
    status: z.enum(["open", "answered", "resolved", "closed"]).optional(),
});

export {createDoubtSchema, updateDoubtSchema};
