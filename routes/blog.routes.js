import express from "express";
import * as blogController from "../controllers/blog.controller.js";
import validate from "../middleware/validate.middleware.js";
import {createBlogSchema, updateBlogSchema} from "../schema/blog.schema.js";
import {authenticate, requireRole} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/all", blogController.getAllBlogs);
router.get("/trending", blogController.getTrendingBlogs);
router.get("/tag/:tag", blogController.getBlogsByTag);
router.get("/mentor/:mentorId", blogController.getBlogsByMentor);
router.get("/:blogId", blogController.getBlogById);

// Protected routes (mentor only)
router.post(
    "/",
    authenticate,
    requireRole("mentor"),
    validate(createBlogSchema),
    blogController.createBlog
);
router.patch(
    "/:blogId",
    authenticate,
    validate(updateBlogSchema),
    blogController.updateBlog
);
router.delete("/:blogId", authenticate, blogController.deleteBlog);

// Like route (authenticated users)
router.post("/:blogId/like", authenticate, blogController.likeBlog);

export default router;
