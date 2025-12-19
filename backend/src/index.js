require('dotenv').config(); // Load env vars
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// basic health
app.get('/', (req, res) => res.send({ ok: true, env: process.env.NODE_ENV || 'dev' }));

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
    // options no longer required for Mongoose v7
})
    .then(async () => {
        console.log('🗄️ MongoDB connected');

        // Seed Admin
        try {
            const adminExists = await User.findOne({ email: 'admin@gmail.com' });
            if (!adminExists) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash('admin', salt);
                await User.create({
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    passwordHash,
                    isAdmin: true
                });
                console.log('👑 Admin user created: admin@gmail.com / admin');
            }
        } catch (err) {
            console.error('Admin seed failed', err);
        }

        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
