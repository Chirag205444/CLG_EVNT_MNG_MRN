const postModel = require('../models/post.model');
const registrationModel = require('../models/registration.model');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Classifies the student's question into a specific query intent
 * @param {string} question - The raw student query
 * @returns {string} Intent key
 */
const detectIntent = (question) => {
    const q = question.toLowerCase().trim();

    // Registrations
    if (q.includes('my registration') || q.includes('my rsvp') || q.includes('show my') || q.includes('am i registered') || q.includes('what registrations')) {
        return 'my_registrations';
    }

    // Deadlines
    if (q.includes('deadline') || q.includes('last date') || q.includes('due date')) {
        return 'registration_deadlines';
    }

    // Workshops
    if (q.includes('workshop') || q.includes('workshops') || q.includes('seminar')) {
        return 'upcoming_workshops';
    }

    // Placements
    if (q.includes('placement') || q.includes('job') || q.includes('drive') || q.includes('google') || q.includes('recruitment')) {
        return 'placement_drives';
    }

    // Hackathons
    if (q.includes('hackathon') || q.includes('hackathons') || q.includes('codequest') || q.includes('coding competition')) {
        return 'hackathons';
    }

    // Announcements
    if (q.includes('announcement') || q.includes('announcements') || q.includes('latest update') || q.includes('notice')) {
        return 'announcements';
    }

    // Events Today
    if (q.includes('today') || q.includes('happening today') || q.includes('current events')) {
        return 'events_today';
    }

    // Available seats
    if (q.includes('seat') || q.includes('spots') || q.includes('vacancy') || q.includes('available')) {
        return 'available_seats';
    }

    // Default fallback to keyword matching or general events search
    return 'general';
};

/**
 * Queries MongoDB database based on detected intent
 * @param {string} intent - Detected intent
 * @param {string} question - The raw student query
 * @param {object} user - Authenticated user details
 */
const fetchDataByIntent = async (intent, question, user) => {
    const now = new Date();

    switch (intent) {
        case 'my_registrations': {
            if (!user || !user._id) {
                return { type: 'error', data: 'User is not authenticated.' };
            }
            const registrations = await registrationModel.find({ student: user._id })
                .populate('post')
                .lean();
            const posts = registrations.map(r => r.post).filter(Boolean);
            return { type: 'registrations', data: posts };
        }
        case 'registration_deadlines': {
            const posts = await postModel.find({
                registrationDeadline: { $gte: now }
            })
                .sort({ registrationDeadline: 1 })
                .limit(10)
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'upcoming_workshops': {
            const posts = await postModel.find({
                category: 'workshop',
                eventDate: { $gte: now }
            })
                .sort({ eventDate: 1 })
                .limit(10)
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'placement_drives': {
            const posts = await postModel.find({
                category: 'placement',
                eventDate: { $gte: now }
            })
                .sort({ eventDate: 1 })
                .limit(10)
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'hackathons': {
            const posts = await postModel.find({
                category: 'hackathon',
                eventDate: { $gte: now }
            })
                .sort({ eventDate: 1 })
                .limit(10)
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'announcements': {
            const posts = await postModel.find({
                category: 'announcement'
            })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'events_today': {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            const posts = await postModel.find({
                eventDate: { $gte: startOfToday, $lte: endOfToday }
            })
                .sort({ eventDate: 1 })
                .lean();
            return { type: 'posts', data: posts };
        }
        case 'available_seats': {
            const posts = await postModel.find({
                eventDate: { $gte: now }
            })
                .sort({ eventDate: 1 })
                .limit(15)
                .lean();

            const postsWithSeats = [];
            for (const post of posts) {
                if (post.maxParticipants === null || post.maxParticipants === undefined) {
                    postsWithSeats.push({ ...post, seatsLeft: 'Unlimited' });
                    continue;
                }
                const count = await registrationModel.countDocuments({ post: post._id });
                if (count < post.maxParticipants) {
                    postsWithSeats.push({ ...post, seatsLeft: post.maxParticipants - count });
                }
            }
            return { type: 'posts_with_seats', data: postsWithSeats };
        }
        case 'general':
        default: {
            const words = question.split(/\s+/).filter(w => w.length > 2);
            let posts = [];

            if (words.length > 0) {
                const searchRegexes = words.map(w => new RegExp(w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i'));
                posts = await postModel.find({
                    $or: [
                        { title: { $in: searchRegexes } },
                        { description: { $in: searchRegexes } },
                        { category: { $in: searchRegexes } }
                    ]
                })
                    .sort({ eventDate: -1 })
                    .limit(10)
                    .lean();
            }

            if (posts.length === 0) {
                posts = await postModel.find({
                    eventDate: { $gte: now }
                })
                    .sort({ eventDate: 1 })
                    .limit(10)
                    .lean();
            }

            return { type: 'posts', data: posts };
        }
    }
};

/**
 * Stringifies database records for prompt inclusion
 * @param {object} fetchResult - Object containing data and type
 * @returns {string} Structured database records text
 */
const formatDatabaseInfo = (fetchResult) => {
    if (!fetchResult || !fetchResult.data || fetchResult.data.length === 0) {
        return "No matching records found in the database.";
    }

    const { type, data } = fetchResult;

    if (type === 'registrations') {
        return data.map((post, idx) => {
            return `${idx + 1}. Title: ${post.title}
   Category: ${post.category}
   Venue: ${post.venue || 'Online'}
   Date: ${post.eventDate ? new Date(post.eventDate).toISOString().split('T')[0] : 'To Be Decided'}
   Description: ${post.description}`;
        }).join('\n\n');
    }

    if (type === 'posts_with_seats') {
        return data.map((post, idx) => {
            return `${idx + 1}. Title: ${post.title}
   Category: ${post.category}
   Venue: ${post.venue || 'Online'}
   Date: ${post.eventDate ? new Date(post.eventDate).toISOString().split('T')[0] : 'To Be Decided'}
   Seats Left: ${post.seatsLeft}
   Max Seats: ${post.maxParticipants || 'Unlimited'}
   Description: ${post.description}`;
        }).join('\n\n');
    }

    return data.map((post, idx) => {
        return `${idx + 1}. Title: ${post.title}
   Category: ${post.category}
   Venue: ${post.venue || 'Online'}
   Date: ${post.eventDate ? new Date(post.eventDate).toISOString().split('T')[0] : 'To Be Decided'}
   Deadline: ${post.registrationDeadline ? new Date(post.registrationDeadline).toISOString().split('T')[0] : 'None'}
   Description: ${post.description}`;
    }).join('\n\n');
};

/**
 * Sends prompt request to Google Gemini API using the official SDK
 * @param {string} prompt - Structured prompt text
 * @returns {Promise<string>} Natural language completion response
 */
const callGeminiAPI = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        });

        const text = response.text || "No output";
        return text.trim();
    } catch (error) {
        if (error.status === 429 || (error.message && (error.message.includes("429") || error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("exhausted")))) {
            return "Hey! You've reached today's API limit. Please try again later.";
        }
        console.error("Gemini API error:", error.message || error);
        throw error;
    }
};

/**
 * Orchestrates the full intent -> query -> prompt -> Gemini flow
 * @param {string} question - Student's question
 * @param {object} user - Authenticated user details
 * @returns {Promise<string>} Generated text reply
 */
const askGeminiWithContext = async (question, user) => {
    const intent = detectIntent(question);
    const fetchResult = await fetchDataByIntent(intent, question, user);

    if (fetchResult.type === 'error') {
        throw new Error(fetchResult.data);
    }

    if (!fetchResult.data || fetchResult.data.length === 0) {
        return "I couldn't find any matching events in CampusHub.";
    }

    const dbInfoString = formatDatabaseInfo(fetchResult);

    // Build strict prompt template
    const prompt = `You are CampusHub AI, a helpful campus assistant.
Answer the student's question ONLY using the database information provided below.
Do not invent events.
Do not assume information that is not present.
If the requested information does not exist or says "No matching records found", politely state that no matching records were found.
Keep the response friendly, concise, and professional.
Use clean formatting and markdown bullet points if multiple events are mentioned.

Database Information:
${dbInfoString}

Student Question:
${question}

Answer:`;

    return await callGeminiAPI(prompt);
};

module.exports = {
    detectIntent,
    fetchDataByIntent,
    askGeminiWithContext
};
