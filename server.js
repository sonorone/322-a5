/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: ___Damian_Murawiecki__ Student ID: __121531164__ Date: ___February_3,2018_ *
* Online (Heroku) Link: 

https://floating-eyrie-97898.herokuapp.com/

* ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const ds = require("./data-service.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bodyParser = require('body-parser');
const app = express().use(express.static("public"));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post("/images/add",upload.single('imageFile'), (req,res) => {
    //  When accessed, this route will redirect to "/images" (defined below) 
    res.redirect("/images");
});

app.get("/images", (req,res) => {


    var dirFiles = [];
    fs.readdir(path.join(__dirname, '/public/images/uploaded/'), (err, items) => {

        var dirFiles = [];
        items.forEach(element => {
            dirFiles.push(element);
        });
        res.json({ "images": dirFiles });


    });

    

});



app.get("/public/css/site.css", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/css/site.css"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.get("/employees", (req, res) => {
    // returns JSON formatted string containing
    // all of the employees within the employees.json file:
    ds
        .getAllEmployees()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json("message: " + err);
        });
});


app.get("/managers", (req, res) => {
    // returns JSON formatted string containing
    // all the employees who are managers, or error msg if failed loading
    ds
        .getManagers()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json("message: " + err);
        });
});

app.get("/departments", (req, res) => {
    // returns JSON formatted string containing
    // all of the departmnets within the departments.json file:
    ds
        .getDepartments()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json("message: " + err);
        });
});

/**
 * 404 - resource not found
 */
app.use(function(req, res) {
    res.status(404).send("Page Not Found");
});

/**
 * only start your server when initilize promise is resolved
 */
ds.initialize()
    .then(function() {
        app.listen(HTTP_PORT, function() {
            console.log("listening to port: " + HTTP_PORT);
        });
    })
    .catch(function() {
        console.log("initialization rejected - server cannot be started");
    });
