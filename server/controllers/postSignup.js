const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('../models/User')

const postSignup = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { username, email, password } = req.body
    try {
        // Check if username or email already exists in the database
        let user = User.findOne({ email }) || User.findOne({ username })
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Username or email already in use.'}] })
        }
        // Create a new user and hash the password
        user = new User({
            username,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        
        // Save the user to the database
        await user.save()
        
        // Generate a JWT session token for the user
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }

        const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '48h' })
        res.json({token})

    } catch (err) {
        console.error(err.message)
        res.status(500).server('Server error on signup.')
    }
};

module.exports = postSignup