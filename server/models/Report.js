import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['post', 'comment', 'user'],
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    targetTitle: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: [
        'Spam',
        'Harassment',
        'Hate Speech',
        'Misinformation',
        'Inappropriate Content',
        'Copyright Violation',
        'Other'
      ]
    },
    details: {
      type: String,
      maxlength: [500, 'Details cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
