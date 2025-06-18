const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const engine=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const localStratagy=require("passport-local");
const User=require("./models/user.js");
require('dotenv').config();



const listingsRouter=require("./routes/listings.js"); //for listing routes
const reviewsRouter=require("./routes/review.js");  //for review routes
const userRouter=require("./routes/user.js");


const passport = require("passport");
 


const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("successfully conneted to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl); 
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public"))); 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',engine);

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 *3600,  
})

store.on("error",()=>{
    console.log("Error in MONO SESSIONS STORE",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days in ms
    },
    httpOnly:true,
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware for local variables
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
    
})

// //demouser for authentication
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"vinith@gmail.com",
//         username:"vinith"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// defing middleware for error handling - custom eror handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something wne wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
    
})


app.listen(8080,()=>{
    console.log("app is listening");
})