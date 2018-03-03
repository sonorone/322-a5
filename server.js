/*********************************************************************************
* WEB322 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: ___Damian_Murawiecki__ Student ID: __121531164__ Date: ___February_25,2018_ *
* Online (Heroku) Link: 

https://glacial-everglades-83710.herokuapp.com/ 

* ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const ds = require("./data-service.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(function(req,res,next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
// template engine
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li ' + ((url == app.locals.activeRoute) ? 'class="active"' : '' ) + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue,rvalue,options) {
            if (arguments.length < 3)
            throw new Error('Hendlebars Helper equal needs 2 parameters');
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get("/employee/:empNum", (req, res) => {
    ds
        .getEmployeeByNum(req.params.empNum)
        .then(data => {
            res.render('employee', {employee: data });
        })
        .catch(err => {
            res.render('employee', {message: err });
        });
});

app.post('/employee/update', (req,res) => {
    ds.updateEmployee(req.body).then(() => {
        res.redirect('/employees');
    });
});

app.get("/images", (req, res) => {
    var dirFiles = [];
    fs.readdir(
        path.join(__dirname, "/public/images/uploaded/"),
        (err, items) => {
            var dirFiles = [];
            items.forEach(element => {
                dirFiles.push(element);
            });
            res.render('images', { data: dirFiles} );
        }
    );
});

app.get("/public/css/site.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/site.css"));
});

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});

app.post("/employees/add", (req, res) => {
    ds
        .addEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch();
});

app.get("/images/add", (req, res) => {
    res.render('addImage');
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    //  When accessed, this route will redirect to "/images" (defined below)
    res.redirect("/images");
});

app.get("/employees", (req, res) => {
    if (req.query.status != null) {
        // console.log("employees query for 'status'");
        ds
            .getEmployeesByStatus(req.query.status)
            .then(data => {
                res.render('employees',{data: data});
                console.log("getEmployeesByStatus promise resolved");
            })
            .catch(err => {
                res.render('employees', {message: err});
                console.log("getEmployeesByStatus promise rejected");
            });
    } else if (req.query.department != null) {
        // console.log("employees query for 'department'");
        ds
            .getEmployeesByDepartment(req.query.department)
            .then(data => {
                res.render('employees',{data: data});
                console.log("getEmployeesByDepartment promise resolved");
            })
            .catch(err => {
                res.render('employees', {message: err});
                console.log("getEmployeesByDepartment promise rejected");
            });
    } else if (req.query.manager != null) {
        // console.log("employees query for 'manager'");
        ds
            .getEmployeesByManager(req.query.manager)
            .then(data => {
                res.render('employees',{data: data});
                console.log("getEmployeesByManager promise resolved");
            })
            .catch(err => {
                res.render('employees', {message: err});
                console.log("getEmployeesByManager promise rejected");
            });
    } else {
        // returns JSON formatted string containing
        // all of the employees within the employees.json file:
        ds
            .getAllEmployees()
            .then(data => {
                res.render('employees',{data: data});
                console.log("getAllEmployees promise resolved");
            })
            .catch(err => {
                res.render('employees', {message: err});
                console.log("getAllEmployees promise rejected");
            });
    }
});

app.get("/departments", (req, res) => {
    // returns JSON formatted string containing
    // all of the departmnets within the departments.json file:
    ds
        .getDepartments()
        .then(data => {
            res.render('departments', {departments: data})
        })
        .catch(err => {
            res.render('departments', {message: err})
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
ds
    .initialize()
    .then(function() {
        app.listen(HTTP_PORT, function() {
            console.log("listening to port: " + HTTP_PORT);
        });
    })
    .catch(function() {
        console.log("initialization rejected - server cannot be started");
    });
