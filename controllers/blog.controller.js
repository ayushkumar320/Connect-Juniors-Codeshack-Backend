import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import MentorProfile from "../models/mentorProfile.model.js";

// Create a new blog (mentor only)
export const createBlog = async (req, res) => {
    try {
        const {title, content, tags, coverImage, readTime, isPublished} =
            req.body;
        const authorId = req.user.userId;

        // Verify user is a mentor
        const user = await User.findById(authorId);
        if (!user || user.role !== "mentor") {
            return res.status(403).json({
                success: false,
                message: "Only mentors can create blogs",
                code: "UNAUTHORIZED",
            });
        }

        // Check if mentor is approved
        if (!user.isMentorApproved) {
            return res.status(403).json({
                success: false,
                message:
                    "Mentor account must be approved by admin to post blogs",
                code: "MENTOR_NOT_APPROVED",
            });
        }

        const blog = new Blog({
            title,
            content,
            authorId,
            tags: tags ? tags.map((tag) => tag.toLowerCase()) : [],
            coverImage,
            readTime:
                readTime || Math.ceil((content?.split(" ").length || 0) / 200), // Estimate read time
            isPublished: isPublished !== undefined ? isPublished : true,
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating blog",
            error: error.message,
        });
    }
};

// Get all published blogs (with pagination and filtering)
export const getAllBlogs = async (req, res) => {
    try {
        const {page = 1, limit = 10, tag, authorId, search} = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = {isPublished: true};

        if (tag) {
            filter.tags = tag.toLowerCase();
        }

        if (authorId) {
            filter.authorId = authorId;
        }

        if (search) {
            filter.$or = [
                {title: {$regex: search, $options: "i"}},
                {content: {$regex: search, $options: "i"}},
            ];
        }

        const blogs = await Blog.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit))
            .populate("authorId", "name email bio")
            .lean();

        const total = await Blog.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                blogs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalBlogs: total,
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blogs",
            error: error.message,
        });
    }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId).populate(
            "authorId",
            "name email bio"
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                code: "BLOG_NOT_FOUND",
            });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blog",
            error: error.message,
        });
    }
};

// Get blogs by mentor
export const getBlogsByMentor = async (req, res) => {
    try {
        const {mentorId} = req.params;
        const {page = 1, limit = 10, includeUnpublished = false} = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Verify mentor exists
        const user = await User.findById(mentorId);
        if (!user || user.role !== "mentor") {
            return res.status(404).json({
                success: false,
                message: "Mentor not found",
                code: "MENTOR_NOT_FOUND",
            });
        }

        const filter = {authorId: mentorId};

        // Only show unpublished blogs to the author or admin
        if (
            includeUnpublished === "true" &&
            (req.user?.userId === mentorId || req.user?.role === "admin")
        ) {
            // Show all blogs (published and unpublished)
        } else {
            filter.isPublished = true;
        }

        const blogs = await Blog.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit))
            .populate("authorId", "name email bio")
            .lean();

        const total = await Blog.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                mentor: {
                    id: user._id,
                    name: user.name,
                    bio: user.bio,
                },
                blogs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalBlogs: total,
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching mentor blogs",
            error: error.message,
        });
    }
};

// Update blog (author only)
export const updateBlog = async (req, res) => {
    try {
        const {blogId} = req.params;
        const {title, content, tags, coverImage, readTime, isPublished} =
            req.body;
        const userId = req.user.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                code: "BLOG_NOT_FOUND",
            });
        }

        // Verify ownership
        if (blog.authorId.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this blog",
                code: "FORBIDDEN",
            });
        }

        if (title) blog.title = title;
        if (content) {
            blog.content = content;
            blog.readTime = Math.ceil((content?.split(" ").length || 0) / 200);
        }
        if (tags) blog.tags = tags.map((tag) => tag.toLowerCase());
        if (coverImage !== undefined) blog.coverImage = coverImage;
        if (readTime !== undefined) blog.readTime = readTime;
        if (isPublished !== undefined) blog.isPublished = isPublished;

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating blog",
            error: error.message,
        });
    }
};

// Delete blog (author or admin only)
export const deleteBlog = async (req, res) => {
    try {
        const {blogId} = req.params;
        const userId = req.user.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                code: "BLOG_NOT_FOUND",
            });
        }

        // Verify ownership
        if (blog.authorId.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this blog",
                code: "FORBIDDEN",
            });
        }

        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting blog",
            error: error.message,
        });
    }
};

// Like a blog
export const likeBlog = async (req, res) => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                code: "BLOG_NOT_FOUND",
            });
        }

        blog.likes += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            data: {likes: blog.likes},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error liking blog",
            error: error.message,
        });
    }
};

// Get blogs by tag
export const getBlogsByTag = async (req, res) => {
    try {
        const {tag} = req.params;
        const {page = 1, limit = 10} = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const blogs = await Blog.find({
            tags: tag.toLowerCase(),
            isPublished: true,
        })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit))
            .populate("authorId", "name email bio")
            .lean();

        const total = await Blog.countDocuments({
            tags: tag.toLowerCase(),
            isPublished: true,
        });

        res.status(200).json({
            success: true,
            data: {
                tag,
                blogs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalBlogs: total,
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blogs by tag",
            error: error.message,
        });
    }
};

// Get trending/popular blogs
export const getTrendingBlogs = async (req, res) => {
    try {
        const {limit = 10} = req.query;

        // Sort by combination of views and likes
        const blogs = await Blog.find({isPublished: true})
            .sort({views: -1, likes: -1, createdAt: -1})
            .limit(parseInt(limit))
            .populate("authorId", "name email bio")
            .lean();

        res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching trending blogs",
            error: error.message,
        });
    }
};
