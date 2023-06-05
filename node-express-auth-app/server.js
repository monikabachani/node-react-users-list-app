const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { dbUrl, secretKey, resetPassSecretKey, mailUser, mailPass, mailFrom } = require('./config');
const User = require('./models/User');
const { verifyToken } = require('./auth');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const PORT = 3000; // Update with your desired port number

app.use(bodyParser.json());
app.use(cors());
app.use(express.static( 'public'));
app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, dob } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword, name, phone, dob });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, secretKey);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ userId: user._id }, resetPassSecretKey, { expiresIn: '10m' });;

        res.json({ message: `Click on the following link to reset your password: http://localhost:3000/reset-password/${resetToken}` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Forgot password failed' });
    }
});

app.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify the token
        const decodedToken = jwt.verify(token, resetPassSecretKey);

        // Find the user
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Password reset failed' });
    }
});

app.get('/user-profile', verifyToken, async (req, res) => {
    try {
        let id = req.userId;
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(200).send({
            message: "User profile",
            user
        })
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/user-list', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // get total documents in the User collection 
        const count = await User.count();

        if (users.length <= 0) {
            return res.status(201).send({ message: 'Data not found', users: [] });
        }
        return res.status(200).send({
            message: "Users list",
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        })
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.error('MongoDB connection error:', error));