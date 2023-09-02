const mongoose=require("mongoose")


const userSchema=mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Please add your username"]
        },
        email:{
            type:String,
            required:[true,"Please add your email"],
            unique:[true,"this email is already taken"]
        },
        password:{
            type:String,
            required:[true,"Please make a password"]
        }
    },
    {
        timestamps:true
    }
)
module.exports=mongoose.model("User",userSchema)