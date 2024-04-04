import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//User registration
const authController = {
    register : async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                picturePath,
                friends,
                location,
                occupation,
            } = req.body
    
            if(await User.findOne({email})){
                return res.status(400).json({message:'User already exists'})
            }
    
            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password,salt)
    
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: passwordHash,
                picturePath,
                friends,
                location,
                occupation,
            })
            const savedUser = await newUser.save()
            res.status(201).json(savedUser)
    
        } catch (error) {
            res.status(500).json({ error:error.message })
        }
    },
    
    // User login in
    login : async (req, res) => {
        try {
            const {email , password} = req.body
            const user = await User.findOne({email: email})
    
            if(!user){
                return res.status(400).json({message:'Opse you have an invalid email or invalid password'})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(400).json({message:'Opse you have an invalid email or invalid password'})
            }
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'30h'})
            delete user.password
            res.status(200).json({
                token,
                user:{
                    _id: user._id,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    picturePath:user.picturePath,
                    friends:user.friends,
                    location:user.location,
                    occupation:user.occupation,
                    viewedProfile:user.viewedProfile,
                    impressions:user.impressions,
                    createdAt:user.createdAt,
                    updatedAt:user.updatedAt,
            }})
    
        } catch (error) {
            res.status(500).json({ error:error.message })
        }
    }
}
export default authController