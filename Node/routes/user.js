const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const JWT_SECRET = 'usersecret';

// Register User
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query('INSERT INTO Users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
        res.status(200).json({ status: 'Account successfully created' });
    } catch (err) {
        res.status(500).json({ status: 'Error creating account' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ status: 'Incorrect username/password provided. Please retry' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'Incorrect username/password provided. Please retry' });
        }

        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ status: 'Login successful', user_id: user.user_id, access_token: token });
    } catch (err) {
        res.status(500).json({ status: 'Login failed' });
    }
});

module.exports = router;