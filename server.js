const express = require('express');
const app = express();
const mongoose = require("./mongodb");
const Student = require("./models/StudentModel");
const { json } = require('body-parser');


app.use(json());

app.get('/students', async(req,res) =>{
    try{
        const students = await Student.find({});
        res.json({status:"Done", ResponseCode:res.statusCode, ResponseObject: students});
    }catch(error){
        res.json({status:error.message, ResponseCode:res.statusCode});
    }
});

app.get('/student/:id',async(req,res) =>{
    try{
        const student = await Student.find(req.params);
        if(student.length == 0) return res.status(404).json({});
        res.status(200).json({status:"Done", ResponseCode:res.statusCode, ResponseObject: student});
    }catch(error){
        res.status(404).json({});
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
        res.json({status:error, ResponseCode:res.statusCode});
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
        res.json({status:error, ResponseCode:res.statusCode});
    }
});

app.delete('/student/:id',async(req,res)=>{
    try{
        let student = await Student.find(req.params);
        if(!student) throw res.status(404);
        student = await Student.findByIdAndDelete(student[0]["_id"]);
        res.status(200).json({status: "done"});
    }catch(error){
        res.json({"error":error});
    }
});


app.listen(3000);

