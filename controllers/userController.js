
const asyncHandler=require("express-async-handler");
const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")


// @desc Register user
// @route POST /api/users/register
// @access private
const registerUser = asyncHandler( async(req,res)=>{
    const {username,email,password}=req.body
    if(!username||!email||!password){
        res.status(400);
        throw new Error('Please provide all required fields')
    }
    const userAvailable=await User.findOne({email})
    if (userAvailable){
        res.status(401);
        throw new Error("Email is Already in use")
    };

    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({
        username,
        email,
        password: hashedPassword
    }
    )
    if(user){
        res.status(201).json({username})
    }else{
        res.status(400)
        throw new Error("Cant register User")
    }
    

})

// @desc login user
// @route POST /api/users/login
// @access private
const loginUser = asyncHandler( async(req,res)=>{
    const {email,password}=req.body

    if(!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const user=await User.findOne({email})
    if(user && await bcrypt.compare(password,user.password)){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            },
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"20m"});
        res.status(201).json({accessToken})
    } else{
        res.status(401)
        throw new Error("Email or password is not valid")
    }
    res.json({message:"login user"})
})

// @desc current user
// @route get /api/users/currentUser
// @access private
const currentUser =asyncHandler( async(req,res)=>{

    res.json(req.user);
})


module.exports={registerUser,loginUser,currentUser}