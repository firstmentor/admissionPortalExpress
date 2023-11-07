const mongoose = require('mongoose')
//define schema
const UserSchemaP = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        public_id:{
        type: String,
        required: true
        },
        url:{
            type: String,
            required: true   
        }
    },
    role:{
        type:String,
        default:'student'
    }
},
    { timestamps: true }
)

//create collection
const UsermodelP= mongoose.model('UserP',UserSchemaP)

module.exports = UsermodelP

