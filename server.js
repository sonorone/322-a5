/*********************************************************************************
* Online (Heroku) Link: 

https://safe-crag-90994.herokuapp.com/

* ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const ds = require("./data-service.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

// middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
    next();
});

// template engine
app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            navLink: function (url, options) {
                return (
                    "<li " + (url == app.locals.activeRoute ? 'class="active"' : "") + '><a href="' +
                    url +  '">' +   options.fn(this) + "</a></li>"
                );
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error(
                        "Hendlebars Helper equal needs 2 parameters"
                    );
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
        }
    })
);
app.set("view engine", ".hbs");


// storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});


// routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/public/css/site.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/site.css"));
});


/**
 * employee section
 */
app.get("/employees", (req, res) => {
    if (req.query.status != null) {
        // console.log("employees query for 'status'");
        ds
            .getEmployeesByStatus(req.query.status)
            .then(data => {
                res.render("employees", {
                    data: data
                });
                console.log("getEmployeesByStatus promise resolved");
            })
            .catch(err => {
                res.render("employees", {
                    message: err
                });
                console.log("getEmployeesByStatus promise rejected");
            });
    } else if (req.query.department != null) {
        // console.log("employees query for 'department'");
        ds
            .getEmployeesByDepartment(req.query.department)
            .then(data => {
                res.render("employees", {
                    data: data
                });
                console.log("getEmployeesByDepartment promise resolved");
            })
            .catch(err => {
                res.render("employees", {
                    message: err
                });
                console.log("getEmployeesByDepartment promise rejected");
            });
    } else if (req.query.manager != null) {
        // console.log("employees query for 'manager'");
        ds
            .getEmployeesByManager(req.query.manager)
            .then(data => {
                res.render("employees", {
                    data: data
                });
                console.log("getEmployeesByManager promise resolved");
            })
            .catch(err => {
                res.render("employees", {
                    message: err
                });
                console.log("getEmployeesByManager promise rejected");
            });
    } else {
        ds
            .getAllEmployees()
            .then(data => {
                if (data.length > 0)
                    res.render("employees", {
                        data: data
                    });
                else
                    res.render("employees", {
                        message: "no results"
                    });
                console.log("getAllEmployees promise resolved. No of Rows:" + data.length);
            })
            .catch(err => {
                res.render("employees", {
                    message: err
                });
                console.log("getAllEmployees promise rejected");
            });
    }
});

app.get("/employees/add", (req, res) => {
    ds.getDepartments().then((departmentData) => {
        res.render("addEmployee", {
            departments: departmentData
        });
    }).catch(() => {
        res.render("addEmployee", {
            departments: []
        });
    });
});

app.post("/employees/add", (req, res) => {
    ds
        .addEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch(()=> {
            res.status(500).send("Unable to Add Employee");
        });
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    ds
        .getEmployeeByNum(req.params.empNum)
        .then(data => {
            if (data) {
                //store employee data in the "viewData" object as "employee"
                viewData.employee = data; 
            } else {
                // set employee to null if none were returned
                viewData.employee = null; 
            }
        })
        .catch(() => {
            // set employee to null if there was an error
            viewData.employee = null; 
        })
        .then(ds.getDepartments)
        .then(data => {
            // store department data in the "viewData" object as "departments"
            viewData.departments = data; 
            // loop through viewData.departments and once we have found the departmentId that matches 
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        })
        .then(() => {
            if (viewData.employee == null) {
                // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", {
                    viewData: viewData
                }); // render the "employee" view
            }
        });
});

app.post("/employee/update", (req, res) => {
    ds.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch(()=> {
        res.status(500).send("Unable to Update Employee / Employee not found");
    });
});

app.get("/employees/delete/:empNum", (req, res) => {
    ds.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
        res.redirect("/employees");
    })
    .catch(()=> {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});


/**
 * images section
 */
app.get("/images", (req, res) => {
    var dirFiles = [];
    fs.readdir(
        path.join(__dirname, "/public/images/uploaded/"),
        (err, items) => {
            var dirFiles = [];
            items.forEach(element => {
                dirFiles.push(element);
            });
            res.render("images", {
                data: dirFiles
            });
        }
    );
});

app.get("/images/add", (req, res) => {
    res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});


/**
 * department section
 */
app.get("/departments", (req, res) => {
    ds
        .getDepartments()
        .then(data => {
            if (data.length > 0)
                res.render("departments", {
                    departments: data
                });
            else
                res.render("departments", {
                    message: "no results"
                });
            console.log("getDepartments promise resolved");
        })
        .catch(err => {
            res.render("departments", {
                message: err
            });
            console.log("getDepartments promise rejected");
        });
});

app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
    ds
        .addDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        })
        .catch(() => {

        });
});

app.get("/departments/:departmentId", (req, res) => {
    ds
        .getDepartmentById(req.params.departmentId)
        .then(data => {
            if (data == undefined)
                res.status(404).send("Department Not Found")
            else
                res.render("department", {
                    department: data
                });
        })
        .catch(err => {
            res.status(404).send("Department Not Found");
            // res.render("department", { message: err });
        });
});

app.post("/department/update", (req, res) => {
    ds.updateDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    }).catch(()=> {
        res.status(500).send("Unable to Update Department / Department not found");
    });
});



/**
 * 404 - resource not found 
 */
app.use(function (req, res) {
    res.status(404).send("Page Not Found");
});



// only start your server when initilize promise is resolved
ds
    .initialize()
    .then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("listening to port: " + HTTP_PORT);
        });
    })
    .catch(function () {
        console.log("initialization rejected - server cannot be started");
    });
