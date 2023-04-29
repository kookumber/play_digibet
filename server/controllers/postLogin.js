const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const User = require('../models/User')


const postLogin = async (req, res) => {

    // Check if there were validation errors and return errors and status 400 if so
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    
    try {
        // Check if user already exists in the database
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }]})
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Password is incorrect!' }] })
        }

        // Generate JWT token for user and send
        const payload = {
            user: {
                id: user.id
            }
        }

        const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 4800 })
        res.json({ token })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}

module.exports = postLogin