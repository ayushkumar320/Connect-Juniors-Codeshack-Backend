import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doubtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doubt",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes
commentSchema.index({doubtId: 1});
commentSchema.index({userId: 1});
commentSchema.index({parentCommentId: 1});

export default mongoose.model("Comment", commentSchema);
