const Usermodel = require ('../models/auth.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    const { username, email, password,  role = "user", phone_numnber } = req.body;
    
    try {
        const existingUser = await Usermodel.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Usermodel({
            username,
            email,
            password: hashedPassword,
            role,
            phone_numnber
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function login(req, res) {
    const { email, password, username } = req.body;

    try {
        const user = await Usermodel.findOne({
            $or: [{ email }, { username }]
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or username' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
         res
          .cookie("token", token, { httpOnly: true })
          .status(200)
          .json({
              message: "Login successful",
              user: {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role
              }
          });   

    }  catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}





module.exports = { register,login };

