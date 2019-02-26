/*********************************************************************************
* Online (Heroku) Link: 

https://safe-crag-90994.herokuapp.com/

* ********************************************************************************/
const Sequelize = require("sequelize");

var sequelize = new Sequelize(
    "d9u6joso2lqj8c",
    "rdixcmvcyifhye",
    "fe38d627b265ca5bacaf330dee9b45f83c6ab4b81a38908e4b056bf10649b51c", 
    {
        host: "ec2-23-21-166-148.compute-1.amazonaws.com",
        port: 5432,
        dialect: "postgres",
        dialectOptions: {
            ssl: true
        }
    }
);

var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.DATE
});

var Department = sequelize.define("Department", {
    departmentId: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    departmentName: Sequelize.STRING
});

// Department.hasMany(Employee);

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize
            .sync()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("ERROR: unable to sync the database");
            });
    }); // end of Promise
}; // end of initialize()

module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll()
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("ERROR: Employee.findAll: no results returned. ERR: " + err);
            });
    });
};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    status: status
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("ERROR: Employee.findAll by 'status': no results returned. ERR: " + err);
            });
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
                where: {
                    department: department
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("ERROR: Employee.findAll by 'department': no results returned. ERR: " + err);
            });
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("ERROR: Employee.findAll by 'manager': no results returned. ERR: " + err);
        });
    });
};

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("ERROR: Employee.findAll by 'employee number': no results returned. ERR: " + err);
        });
    });
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("ERROR: Department.findAll: no results returned. ERR: " + err);
        });
    });
};

module.exports.addEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (var prop in employeeData)
        if (employeeData[prop] == "") employeeData[prop] = null;

    return new Promise(function (resolve, reject) {
        Employee.create({
            // employeeNum: { type: primaryKey, autoIncrement: true }
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            // maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            console.log("SUCCESS: Employee.create: new employee added");
            resolve();
        }).catch(() => {
            reject("ERROR: unable to create employee");
        });
    });
};

module.exports.updateEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (var prop in employeeData)
        if (employeeData[prop] === "") employeeData[prop] = null;

    return new Promise(function (resolve, reject) {
        Employee.update({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        }).then(() => {
            console.log("SUCCESS: Employee.update: employee updated");
            resolve();
        }).catch((err) => {
            reject("ERROR: unable to update employee. Here is why: " + err);
        });
    });
};

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise((resolve,reject)=> {

        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(()=> {
            console.log("SUCCESS: Employee has been destroyed o_O .");
            resolve();
        })
        .catch((err)=> {
            reject("ERROR: Employee cannot be destroyed <o> . Here is why: " + err);
        });
    });
}

module.exports.addDepartment = function (departmentData) {
    if (departmentData === "") 
        departmentData = null;
    return new Promise((resolve, reject)=> {
        Department.create({
            departmentName: departmentData.departmentName
        })
        .then( ()=> { console.log("SUCCESS: added department"); resolve(); })
        .catch(()=> { console.log("ERROR: add department failure"); reject("unable to create department"); });
    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise((resolve, reject)=> {

        for (var prop in departmentData) {
            if (departmentData[prop] === "") 
                departmentData[prop] = null;
        }
    
        if (departmentData.departmentName === null) 
        {
            Department.destroy({
                where: { departmentId: departmentData.departmentId }
            })
            .then( ()=> { console.log("SUCCESS: destroyed department"); resolve(); })
            .catch(()=> { console.log("ERROR: destroyed department failure"); reject("unable to destroy 'empty' department"); });
        }
        else
        {
            Department.update(  { departmentName: departmentData.departmentName },
                                { where: { departmentId: departmentData.departmentId } } )
            .then( ()=> { console.log("SUCCESS: updated department"); resolve(); })
            .catch(()=> { console.log("ERROR: update department failure"); reject("unable to update department"); });
        }

    });

};

module.exports.getDepartmentById = function (departmentId) {
    return new Promise((resolve,reject)=>{
        Department.findAll({
            where: { departmentId: departmentId }   //, order: [ ['department', 'ASC'] ]
        }).then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject("ERROR: unable to get department: findAll by 'department id': no results returned. ERR: " + err);
        });
    });  
};
