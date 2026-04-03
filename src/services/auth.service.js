const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

async function register(data) {
    // Check if email is already exists
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existing) {
        const error = new Error('Email already in use');
        error.status = 409;
        throw error; 0
    }

    // Hash the password - never store plain text 
    // 12 = salt rounds, higher = slower = more secure
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
        },
    });

    // Never return the password - not even the hashed one
    const { password, ...userWithoutPassword } = user;

    const token = generateToken(user.id);

    return { user: userWithoutPassword, token };
}

async function login(data) {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    // IMPORTANT: same error message wether email or password is wrong
    // Never tell the client which one failed - that's info leakage
    if (!user) {
        const error = new Error("Invalid Email or Password");
        error.status = 401;
        throw error;
    }

    // Compare plain text against hashed password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        const error = new Error('Invalid Email or Password');
        error.status = 401;
        throw error;
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    return { user: userWithoutPassword, token };
}

function generateToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

module.exports = { register, login };