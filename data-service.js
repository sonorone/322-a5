var fs = require("fs"),
    path = require("path");
// data module
var employees = [];
var departments = [];
var managers = [];

/*
 This function will read the contents of the "./data/employees.json" file 
 (hint: see the fs module & the fs.readFile method),
 - convert the file's contents into an array of objects (hint: see JSON.parse) , and 
 - assign that array to the employees array (from above).
 */
module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        fs.readFile("./data/employees.json", (err, data) => 
            {
                if (err) reject("unable to read files: " + err);
                else {
                    employees = JSON.parse(data);
                    console.log("employee data loaded");
                }

                fs.readFile("./data/departments.json", (err, data) => {
                    if (err) reject("unable to read files: " + err);
                    else {
                        departments = JSON.parse(data);
                        console.log("departments data loaded");
                        resolve();
                    }
                });
            }
        ); // end of readFile
    }); // end of Promise
}; // end of initialize()

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject) {
        if (employees.length == 0) reject("no results returned");
        else resolve(employees);
    });
};

module.exports.getManagers = function() {
    return new Promise(function(resolve, reject) {
        employees.forEach(function(e) {
            if (e.isManager == true) managers.push(e);
        });

        if (managers.length == 0) reject("no results returned");
        else resolve(managers);
    });
};

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject) {
        if (departments.length == 0) reject("no results returned");
        else resolve(departments);
    });
};