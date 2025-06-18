const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../routes/middleware.js");
const { createReview } = require("../controllers/reviews.js");

const reviewController=require("../controllers/reviews");

//posting reviews -post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;
