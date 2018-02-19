var fs = require("fs"),
    path = require("path");

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
        fs.readFile("./data/employees.json", (err, data) => {
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
        }); // end of readFile
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

module.exports.addEmployee = function(employeeData) {
    return new Promise(function(resolve, reject) {
        if (employeeData.isManager == null) {
            employeeData.isManager = false;
        } else {
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;

        // push returns the new number of items, therefore should match with emp#``
        if (employees.push(employeeData) == employeeData.employeeNum) {
            resolve("new employee added");
        } else {
            console.log(
                "employee data was not added.\nEmp# doesn't match number of items in the employees array..."
            );
            reject();
        }
    });
};

module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function(resolve, reject) {
        let empByStatus = [];
        employees.forEach(e => {
            if (e.status == status) empByStatus.push(e);
        });
        if (empByStatus.length == 0) reject("no results returned");
        else resolve(empByStatus);
    });
};

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function(resolve,reject) {
        let empByDept = [];
        employees.forEach(e => {
            if (e.department == department) empByDept.push(e);
        });
        if (empByDept.length == 0) reject("no results returned");
        else resolve(empByDept);
    });
};

module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function(resolve,reject) {
        let empByMgr = [];
        employees.forEach(e => {
            if (e.employeeManagerNum == manager) empByMgr.push(e);
        });
        if (empByMgr.length == 0) reject("no results returned");
        else resolve(empByMgr);
    });
};

module.exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        employees.forEach(e => {
            if (e.employeeNum == num) resolve(e);
        });
        reject("no results returned");
    });
};