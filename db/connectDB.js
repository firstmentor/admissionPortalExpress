const mongoose = require('mongoose')
const url = "mongodb://0.0.0.0:27017/AdmissionPortalP"
//mongo db cluster url
const liveURL = 'mongodb+srv://pn234:pn12345@cluster0.0zdmk.mongodb.net/admissionportal?retryWrites=true&w=majority'
const connectDB = ()=>{
    return mongoose.connect(liveURL)
    .then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports=connectDB