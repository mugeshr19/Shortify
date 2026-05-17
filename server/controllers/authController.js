const User = require("../models/User")
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const register = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const user =  await User.create({
            email,
            password: hashedPassword
        });
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }       
};

const login = async(req,res)=>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user&&(await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    register,
    login
};