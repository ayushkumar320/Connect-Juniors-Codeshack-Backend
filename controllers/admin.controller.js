import AdminAction from '../models/adminAction.model.js';
import User from '../models/user.model.js';
import MentorProfile from '../models/mentorProfile.model.js';
import Doubt from '../models/doubt.model.js';
import Answer from '../models/answer.model.js';
import Comment from '../models/comment.model.js';
import JuniorSpacePost from '../models/juniorSpacePost.model.js';

export const approveMentor = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { mentorUserId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const mentorProfile = await MentorProfile.findOne({ userId: mentorUserId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    mentorProfile.approvedByAdmin = true;
    await mentorProfile.save();

    const mentor = await User.findById(mentorUserId);
    mentor.isMentorApproved = true;
    await mentor.save();

    const adminAction = new AdminAction({
      adminId,
      actionType: 'approve_mentor',
      targetId: mentorUserId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Mentor approved successfully',
      data: {
        mentorId: mentorUserId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving mentor',
      error: error.message
    });
  }
};

export const rejectMentor = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { mentorUserId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const mentorProfile = await MentorProfile.findOneAndDelete({ userId: mentorUserId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    const adminAction = new AdminAction({
      adminId,
      actionType: 'reject_mentor',
      targetId: mentorUserId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Mentor rejected and profile deleted',
      data: {
        mentorId: mentorUserId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting mentor',
      error: error.message
    });
  }
};

export const deleteDoubt = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { doubtId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const doubt = await Doubt.findByIdAndDelete(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found',
        code: 'DOUBT_NOT_FOUND'
      });
    }

    await Answer.deleteMany({ doubtId });
    await Comment.deleteMany({ doubtId });

    const adminAction = new AdminAction({
      adminId,
      actionType: 'delete_doubt',
      targetId: doubtId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Doubt deleted successfully',
      data: {
        doubtId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doubt',
      error: error.message
    });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { answerId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const answer = await Answer.findByIdAndDelete(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
        code: 'ANSWER_NOT_FOUND'
      });
    }

    const adminAction = new AdminAction({
      adminId,
      actionType: 'delete_answer',
      targetId: answerId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Answer deleted successfully',
      data: {
        answerId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting answer',
      error: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { commentId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        code: 'COMMENT_NOT_FOUND'
      });
    }

    await Comment.deleteMany({ parentCommentId: commentId });

    const adminAction = new AdminAction({
      adminId,
      actionType: 'delete_comment',
      targetId: commentId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: {
        commentId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

export const deleteJuniorPost = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { postId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const post = await JuniorSpacePost.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    const adminAction = new AdminAction({
      adminId,
      actionType: 'delete_junior_post',
      targetId: postId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'Junior space post deleted successfully',
      data: {
        postId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting junior post',
      error: error.message
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { userId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const adminAction = new AdminAction({
      adminId,
      actionType: 'ban_user',
      targetId: userId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: {
        userId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error banning user',
      error: error.message
    });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { userId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const adminAction = new AdminAction({
      adminId,
      actionType: 'unban_user',
      targetId: userId
    });

    await adminAction.save();

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      data: {
        userId,
        actionId: adminAction._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unbanning user',
      error: error.message
    });
  }
};

export const getAdminActions = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { page = 1, limit = 20, actionType } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const filter = { adminId };
    if (actionType) filter.actionType = actionType;

    const actions = await AdminAction.find(filter)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await AdminAction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: actions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin actions',
      error: error.message
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action',
        code: 'UNAUTHORIZED'
      });
    }

    const totalActions = await AdminAction.countDocuments({ adminId });
    const actionBreakdown = await AdminAction.aggregate([
      { $match: { adminId: admin._id } },
      { $group: { _id: '$actionType', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActions,
        actionBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};
