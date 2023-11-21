const express = require('express');
const app = express();
const mongoose = require("./mongodb");
const Student = require("./models/StudentModel");
const { json } = require('body-parser');
app.use(json());

function SortingBy(students, key){
    let data = students;
    let swaped;
    let temp;
    for(let i = 0; i < data.length; i++){
        swaped = false;
        for(let j = 0; j < data.length - 1;j++){
            if(data[j][key] < data[j + 1][key]){
                temp = data[j][key];
                data[j][key] = data[j+1][key];
                data[j+1][key] = temp;
                swaped = true;
            }
        }
        if(swaped == false) {
            return data;
        }
    }
    return data;
}

app.get('/students', async(req,res) =>{
    try{
        let students = await Student.find({});
        if (req.body["SortBy"] != undefined && students.length > 1){
            if(req.body["SortBy"] == "rate" || req.body["SortBy"] == "group"){
                students = SortingBy(students, req.body["SortBy"]);
            } 
        }
        res.status(200).json(students);
    }catch(error){
        console.log(error)
        res.status(404).json({status:error});
    }
});

app.get('/student/:id',async(req,res) =>{
    try{
        const student = await Student.find(req.params);
        if(student.length == 0) return res.status(404).json({});
        res.status(200).json(student);
    }catch(error){
        res.status(404).json({status:error});
    }
});

app.post('/student/:id', async(req,res) =>{
    try{
        let student = await Student.find(req.params);
        if(student.length >= 1) throw "Student with that id already created";
        if(req.body["firstName"] != undefined && req.body["firstName"] != ""){
            if(req.body["lastName"] != undefined && req.body["lastName"] != ""){
                let group = 0;
                let rate = 0;
                if(req.body["group"] != undefined && req.body["group"] != null) group = req.body["group"];
                if(req.body["rate"] != undefined && req.body["rate"] != null) rate = req.body["rate"];
                await Student.create({
                    "id": req.params["id"],
                    "firstName": req.body["firstName"],
                    "lastName": req.body["lastName"],
                    "group": group,
                    "rate": rate
                });
            }
            else throw "lastName expected";
        }
        else throw "firstName expected";
        res.status(200).json();
    }
    catch(error){
        res.status(404).json({status:error});
    }
});

app.put('/student/:id',async(req,res)=>{
    try{
        let student = await Student.find(req.params);
        if(!student) throw "student don't finded";
        if(req.body["firstName"] != undefined && req.body["firstName"] == "") throw "Body object firstName can't be empty";
        if(req.body["lastName"] != undefined && req.body["lastName"] == "") throw "Body object lastName can't be empty";
        let updateReq = {
        };
        if(req.body["firstName"] != undefined) updateReq = {...updateReq, firstName: req.body["firstName"] };
        if(req.body["lastName"] != undefined) updateReq = {...updateReq, firstName: req.body["lastName"] };
        if(req.body["group"] != undefined) updateReq = {...updateReq, firstName: req.body["group"] }; 
        if(req.body["rate"] != undefined) updateReq = {...updateReq, firstName: req.body["rate"] }; 
        await Student.findByIdAndUpdate(student["_id"], updateReq);
        res.status(200).json({});
    }
    catch(error){
        res.status(404).json({status:error});
    }
});

app.delete('/student/:id',async(req,res)=>{
    try{
        let student = await Student.find(req.params);
        if(!student) throw res.status(404);
        student = await Student.findByIdAndDelete(student[0]["_id"]);
        res.status(200).json({status: "done"});
    }catch(error){
        res.status(404).json({status:error});
    }
});


app.listen(3000);

