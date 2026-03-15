const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_bookstore_key_2024';

module.exports = (db) => {
    const router = express.Router();

    // Register User
    router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                function (err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return res.status(409).json({ error: 'Username already exists' });
                        }
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error during registration' });
        }
    });

    // Login User
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
                expiresIn: '24h',
            });

            res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name, credit_card: user.credit_card } });
        });
    });

    // Middleware to verify token
    const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid token.' });
            req.user = user;
            next();
        });
    };

    // Get Current User (Protected)
    router.get('/me', authenticateToken, (req, res) => {
        db.get('SELECT id, username, role, full_name, credit_card FROM users WHERE id = ?', [req.user.id], (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            
            res.json({ user });
        });
    });

    return router;
};
