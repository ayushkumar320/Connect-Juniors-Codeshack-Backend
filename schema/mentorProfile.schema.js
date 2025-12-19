import {z} from "zod";

// Create Mentor Profile Schema
const createMentorProfileSchema = z.object({
    badge: z.string().max(50).optional(),
    expertiseTags: z
        .array(z.string())
        .min(1, "At least one expertise tag is required")
        .max(10),
});

// Update Mentor Profile Schema
const updateMentorProfileSchema = z.object({
    badge: z.string().max(50).optional(),
    expertiseTags: z.array(z.string()).min(1).max(10).optional(),
});

export {createMentorProfileSchema, updateMentorProfileSchema};
