const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema(
    {
        id:{
            type: Number,
            require: true
        },
        firstName:{
            type: String,
            require: true
        },
        lastName:{
            type: String,
            require: true
        },
        group:{
            type: Number,
            require: true
        },
        rate:{
            type: Number,
            require: true
        }
    }
);

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;