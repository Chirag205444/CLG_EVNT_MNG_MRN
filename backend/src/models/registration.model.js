const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post reference is required']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student reference is required']
    },
    studentName: {
        type: String,
        required: [true, "Student's name is required"],
        trim: true
    },
    studentEmail: {
        type: String,
        required: [true, "Student's email is required"],
        trim: true,
        lowercase: true
    },
    usn: {
        type: String,
        required: [true, 'USN is required'],
        trim: true,
        uppercase: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Unique compound index on post and student to prevent duplicate registrations
registrationSchema.index({ post: 1, student: 1 }, { unique: true });
// Unique compound index on post and usn to prevent duplicate registrations with same usn
registrationSchema.index({ post: 1, usn: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

