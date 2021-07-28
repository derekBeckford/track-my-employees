const mysql = require("mysql");
const inquirer = require("inquirer");
const constTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "12o71991D!",
    database: "employees",
  },
  console.log("Connected to the employee database!")
);

db.connect(function (err) {
  if (err) {
    throw err;
  }
  prompt();
});

console.table("\n---------------- EMPLOYEE TRACKER ----------------\n");

const prompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What Would you like to do?",
        choices: [
          "View All Employees",
          "View All Employeees by Department",
          "View All Employees by Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employees Manager",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choices) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employeees by Department":
          employeeByDepartment();
          break;

        case "View All Employees by Manager":
          viewAllManagers();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employees Manager":
          updateEmployeesManager();
          break;
      }
    });
};

const viewAllEmployees = () => {
  const sql = `SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id`;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.table(result);
  });
};
