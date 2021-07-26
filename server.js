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
  initiate()
});

console.table(
    "\n---------------- EMPLOYEE TRACKER ----------------\n"
)

// SELECT * FROM employee
//     -> LEFT JOIN roles ON employee.role_id = roles.id;