import express, { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js';
import Account from '../models/transferModel.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No such user"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Sign-in successful",
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

router.post('/signup', async (req,res) => {

    const { name, email, password } = req.body;

    if(!name || !password || !email ){
        return res.status(400).json({
            success: false,
            message: "all fields are required"
        })
    }

    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({
            success: false,
            message: "User already exsists"
        })
    }


    const hashedPassword = await bcrypt.hash(password,10);
    const userDetails = new User({
        name: name,
        email: email,
        password: hashedPassword,
    })
    await userDetails.save()

    const account = new Account({
        userId: userDetails.id,
        balance: 1000
    })

    await account.save();

    return res.status(200).json({
        success: true,
        message: "User signed in successfully"
    })
})


export default router;