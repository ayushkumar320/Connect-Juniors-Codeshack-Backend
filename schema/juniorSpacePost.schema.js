import {z} from "zod";

// Create Junior Space Post Schema
const createJuniorSpacePostSchema = z.object({
    content: z.string().min(1, "Post content cannot be empty").max(3000),
});

export {createJuniorSpacePostSchema};
