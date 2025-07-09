import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";


export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'nurse', // Default to 'nurse' if no role is provided
        });
        await user.save();

        res.status(201).json({ message: 'Signup successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed", error: error.message });
        
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password match: ", isMatch);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    };
};

export const logout = async (req, res) => {
    try {
        if(!req.cookies.token) {
            return res.status(401).json({ message: "No token found" });
        }
        // console.log("Logout token: ", req.cookies.token);
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
        
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
        
    }
};