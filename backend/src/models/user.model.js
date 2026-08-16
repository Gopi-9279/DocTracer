import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']    
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    }
},{
    timestamps: true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return 
    }
    const hash = await bcrypt.hash(this.password,10) 
    this.password = hash
    return 
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}


const userModel = new mongoose.model('user', userSchema);

export default userModel;