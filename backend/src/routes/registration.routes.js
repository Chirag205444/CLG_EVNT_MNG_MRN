const express = require('express');
const router = express.Router();

const {
    registerForActivity,
    getMyRegistrations,
    getRegistrationsForActivity,
    updateRegistration,
    deleteRegistration,
    getRegistrationStatus,
    getRegistrationCount,
    exportRegistrationsCSV
} = require('../controlers/registration.controler');

const authMiddleware = require('../middlewares/auth.middleware');
const coordinatorMiddleware = require('../middlewares/coordinator.Middleware');

// Note: Order of routes is important to prevent route clash.

// 1. Get my registrations (accessible to logged-in student)
router.get('/my-registrations', authMiddleware, getMyRegistrations);

// 2. Get registration status for a specific activity (accessible to logged-in student)
router.get('/status/:postId', authMiddleware, getRegistrationStatus);

// 3. Get registration count and remaining seats for a specific activity (accessible to logged-in users)
router.get('/count/:postId', authMiddleware, getRegistrationCount);

// 4. Export registrations as CSV (accessible to coordinator who created the activity)
router.get('/post/:postId/export', authMiddleware, coordinatorMiddleware, exportRegistrationsCSV);

// 5. Get registrations for a specific activity (accessible to logged-in coordinator who created the activity)
router.get('/post/:postId', authMiddleware, coordinatorMiddleware, getRegistrationsForActivity);

// 5. Register for a specific activity (accessible to logged-in student)
router.post('/:postId', authMiddleware, registerForActivity);

// 6. Update registration (accessible to logged-in student who owns the registration)
router.put('/:id', authMiddleware, updateRegistration);

// 7. Cancel registration (accessible to logged-in student who owns the registration)
router.delete('/:id', authMiddleware, deleteRegistration);

module.exports = router;
