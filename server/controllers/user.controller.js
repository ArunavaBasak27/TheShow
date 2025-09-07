import {User} from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.json({
            success:true,
            message:"User registered successfully",
            data:user
        })
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}