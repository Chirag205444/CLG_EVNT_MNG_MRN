const mongoose = require('mongoose');
const registrationModel = require('../models/registration.model');
const postModel = require('../models/post.model');

// 1. Register For Activity
const registerForActivity = async (req, res) => {
    try {
        const { postId } = req.params;
        const usn = req.body.usn ? req.body.usn.trim().toUpperCase() : "";

        // Verify activity ID is valid
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID format"
            });
        }

        // Verify USN is provided
        if (!usn) {
            return res.status(400).json({
                success: false,
                message: "USN is required for registration"
            });
        }

        // Verify user role is student
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: "Only students are allowed to register for activities"
            });
        }

        // Verify activity exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        // Verify registration deadline has not passed
        if (post.registrationDeadline && new Date() > new Date(post.registrationDeadline)) {
            return res.status(400).json({
                success: false,
                message: "Registration deadline has passed"
            });
        }

        // Verify student is not already registered (avoid duplicate)
        const alreadyRegistered = await registrationModel.findOne({ post: postId, student: req.user._id }).lean();
        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: "You are already registered for this activity"
            });
        }

        // Verify USN is not already registered for this activity by another student
        const usnExists = await registrationModel.findOne({ post: postId, usn: usn }).lean();
        if (usnExists) {
            return res.status(400).json({
                success: false,
                message: "This USN is already registered for this activity"
            });
        }

        // Verify seats are still available
        if (post.maxParticipants !== null && post.maxParticipants !== undefined) {
            const count = await registrationModel.countDocuments({ post: postId });
            if (count >= post.maxParticipants) {
                return res.status(400).json({
                    success: false,
                    message: "No seats available. Activity is full"
                });
            }
        }

        // Create registration document
        const registration = await registrationModel.create({
            post: postId,
            student: req.user._id,
            studentName: req.user.name.trim(),
            studentEmail: req.user.email.toLowerCase().trim(),
            usn: usn
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            data: registration
        });

    } catch (err) {
        console.error("Error in registerForActivity:", err);
        // Handle duplicate key index error just in case
        if (err.code === 11000) {
            const isUsnDup = err.message && err.message.includes('usn');
            return res.status(400).json({
                success: false,
                message: isUsnDup
                    ? "This USN is already registered for this activity"
                    : "You are already registered for this activity"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 2. Get My Registrations
const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await registrationModel.find({ student: req.user._id })
            .populate('post')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: registrations
        });
    } catch (err) {
        console.error("Error in getMyRegistrations:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 3. Get Registrations For Activity
const getRegistrationsForActivity = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID format"
            });
        }

        // Verify activity exists
        const post = await postModel.findById(postId).lean();
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        // Verify authorization: only the coordinator who created the activity can view registrations
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only view registrations for activities you created"
            });
        }

        const registrations = await registrationModel.find({ post: postId })
            .select('studentName studentEmail usn registeredAt post')
            .populate('post', 'title description category venue eventDate maxParticipants registrationDeadline')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: registrations
        });

    } catch (err) {
        console.error("Error in getRegistrationsForActivity:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 4. Update Registration
const updateRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const usn = req.body.usn ? req.body.usn.trim().toUpperCase() : "";

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration ID format"
            });
        }

        if (!usn) {
            return res.status(400).json({
                success: false,
                message: "USN is required"
            });
        }

        const registration = await registrationModel.findById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Verify student ownership
        if (registration.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own registration"
            });
        }

        // Verify USN is not already registered for this activity by another student
        const usnExists = await registrationModel.findOne({
            post: registration.post,
            usn: usn,
            _id: { $ne: registration._id }
        }).lean();
        if (usnExists) {
            return res.status(400).json({
                success: false,
                message: "This USN is already registered for this activity"
            });
        }

        // Only allow updating USN
        registration.usn = usn;
        const updatedRegistration = await registration.save();

        return res.status(200).json({
            success: true,
            message: "Registration updated successfully",
            data: updatedRegistration
        });

    } catch (err) {
        console.error("Error in updateRegistration:", err);
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This USN is already registered for this activity"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 5. Delete Registration
const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration ID format"
            });
        }

        const registration = await registrationModel.findById(id).populate('post');
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Verify ownership: either the student who registered or the coordinator who created the event
        const isStudentOwner = registration.student.toString() === req.user._id.toString();
        const isEventCoordinatorCreator = registration.post && registration.post.createdBy && registration.post.createdBy.toString() === req.user._id.toString();

        if (!isStudentOwner && !isEventCoordinatorCreator) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel or remove this registration"
            });
        }

        await registrationModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Registration cancelled successfully"
        });

    } catch (err) {
        console.error("Error in deleteRegistration:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 6. Registration Status
const getRegistrationStatus = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID format"
            });
        }

        const registration = await registrationModel.findOne({ post: postId, student: req.user._id })
            .select('_id')
            .lean();

        return res.status(200).json({
            success: true,
            registered: !!registration,
            registrationId: registration ? registration._id : null
        });

    } catch (err) {
        console.error("Error in getRegistrationStatus:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// 7. Registration Count
const getRegistrationCount = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID format"
            });
        }

        const post = await postModel.findById(postId).select('maxParticipants').lean();
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        const count = await registrationModel.countDocuments({ post: postId });
        let remainingSeats = null;

        if (post.maxParticipants !== null && post.maxParticipants !== undefined) {
            remainingSeats = Math.max(0, post.maxParticipants - count);
        }

        return res.status(200).json({
            success: true,
            count,
            remainingSeats
        });

    } catch (err) {
        console.error("Error in getRegistrationCount:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    registerForActivity,
    getMyRegistrations,
    getRegistrationsForActivity,
    updateRegistration,
    deleteRegistration,
    getRegistrationStatus,
    getRegistrationCount
};
