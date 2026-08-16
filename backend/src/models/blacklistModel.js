import mongoose from 'mongoose';

const tokenblackListSchema = new mongoose.Schema({
    token :{
        type : String,
        required : [true,"token is required for blacklisting"]
    }
}, { timestamps: true });


tokenblackListSchema.index({createdAt : 1},{expireAfterSeconds:60*60*24*3})
const tokenblackListModel = new mongoose.model("tokenblacklist",tokenblackListSchema);   


export default tokenblackListModel;