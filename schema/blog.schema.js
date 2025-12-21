import {z} from "zod";

// Create Blog Schema
const createBlogSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title cannot exceed 200 characters")
        .trim(),
    content: z
        .string()
        .min(50, "Content must be at least 50 characters")
        .trim(),
    tags: z
        .array(z.string())
        .min(1, "At least one tag is required")
        .max(10, "Cannot exceed 10 tags")
        .optional(),
    coverImage: z.string().url("Invalid URL format").optional(),
    readTime: z.number().min(0).optional(),
    isPublished: z.boolean().optional(),
});

// Update Blog Schema
const updateBlogSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title cannot exceed 200 characters")
        .trim()
        .optional(),
    content: z
        .string()
        .min(50, "Content must be at least 50 characters")
        .trim()
        .optional(),
    tags: z.array(z.string()).min(1).max(10).optional(),
    coverImage: z.string().url("Invalid URL format").optional(),
    readTime: z.number().min(0).optional(),
    isPublished: z.boolean().optional(),
});

export {createBlogSchema, updateBlogSchema};
