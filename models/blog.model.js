import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    coverImage: {
        type: String,
        trim: true,
    },
    readTime: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes
blogSchema.index({authorId: 1});
blogSchema.index({createdAt: -1});
blogSchema.index({tags: 1});
blogSchema.index({isPublished: 1});

// Update updatedAt before saving
blogSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Blog", blogSchema);
