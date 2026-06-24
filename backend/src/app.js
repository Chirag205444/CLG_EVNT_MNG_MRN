const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cors({
    origin: (origin, callback) => {
        // Dynamically allow any origin (required for credentials: true)
        callback(null, true);
    },
    credentials: true,
}));
require('./db/mongo.db');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.Routes');
const registrationRoutes = require('./routes/registration.routes');

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/registrations', registrationRoutes);

module.exports = app;