const mongoose = require('mongoose')

const CourseSchemaP = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    comment:{
        type:String
    },
    userId:{
        type:String,
        required:true
    }
},
 {timestamps:true}
)

//create collection
const CoursemodelP= mongoose.model('CourseP',CourseSchemaP)
module.exports = CoursemodelP