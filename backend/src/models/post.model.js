const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: ['event', 'placement', 'workshop', 'hackathon', 'announcement', 'club_activity', 'others'],
            message: "Invalid category"
        }
    },
    venue: {
        type: String,
        trim: true
    },
    eventDate: {
        type: Date
    },
    maxParticipants: {
        type: Number,
        default: null,
        validate: {
            validator: function(v) {
                if (v === null || v === undefined) return true;
                return v > 0;
            },
            message: "Max participants must be greater than 0"
        }
    },
    registrationDeadline: {
        type: Date,
        default: null,
        validate: {
            validator: function(v) {
                if (v === null || v === undefined) return true;
                return v > new Date();
            },
            message: "Registration deadline must be a valid future date"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator reference is required"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
