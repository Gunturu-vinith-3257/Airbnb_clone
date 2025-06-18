const Listing=require("../models/listing");
const Review = require("../models/review.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");

//validate listing 
 module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // //redirect to accesed page after login
        req.session.redirectUrl=req.originalUrl;
        //but whien we use session store after login passport resets the data so now we are storing in local var 
        req.flash("error","You must be logged in to add a listing");
        res.redirect("/login");
    }
    next();
};

//validate review 
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

   
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
