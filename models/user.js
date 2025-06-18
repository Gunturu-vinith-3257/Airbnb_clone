const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    //here we no need to define username,password because it create automatically with salt and hashing
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);
