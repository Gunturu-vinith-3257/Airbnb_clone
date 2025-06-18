const mongoose=require('mongoose');
const Listing=require("../models/listing.js");
const initData=require("./data.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("successfully conneted to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url); 
};

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"683cf51498a64e916c978cf8"}));//adding owner
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
}

initDB();