import {z} from "zod";

// Create Junior Space Post Schema
const createPostSchema = z.object({
    content: z.string().min(1, "Post content cannot be empty").max(3000),
    category: z
        .enum(["question", "achievement", "discussion", "resource"])
        .optional(),
});

// Update Junior Space Post Schema
const updatePostSchema = z.object({
    content: z.string().min(1).max(3000).optional(),
    category: z
        .enum(["question", "achievement", "discussion", "resource"])
        .optional(),
});

export {createPostSchema, updatePostSchema};
