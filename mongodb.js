const mongo = require('mongoose');

const CONNECT_STR = "mongodb+srv://admin:CmeoUoOtA5IAdyjB@cluster0.2oihda5.mongodb.net/Node-API?retryWrites=true&w=majority";

mongo.set("strictQuery", false);

mongo.connect(CONNECT_STR)
.then(()=>{
    console.log("Connected to mongoDB instance");
})
.catch((error) => {
    console.log(error);
});