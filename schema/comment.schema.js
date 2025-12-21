import {z} from "zod";

// Create Comment Schema
const createCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
    parentCommentId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid parent comment ID")
        .optional(),
});

// Update Comment Schema
const updateCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
});

export {createCommentSchema, updateCommentSchema};
