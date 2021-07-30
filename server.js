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
          "View All Roles",
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

        case "View All Roles":
          viewAllRoles();
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
  const sql = `select emp.first_name, emp.last_name, rl.title, rl.salary, dpt.department_name from employee emp join roles rl join department dpt on emp.role_id = rl.id AND rl.department_id = dpt.id;`;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const employeeByDepartment = () => {
  const sql = `select emp.first_name, emp.last_name, dpt.department_name from employee emp join roles rl join department dpt on emp.role_id = rl.id AND rl.department_id = dpt.id;`;
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const viewAllRoles = () => {
  const sql = `SELECT rl.title FROM roles rl;`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter their first name",
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter their last name",
      },
      {
        name: "role",
        type: "list",
        message: "What is their role?",
        choices: [
          "Salesperson",
          "Lead Engineer",
          "Engineer",
          "Accountant",
          "Lawyer",
          "CEO",
        ],
      },
      {
        name: "choices",
        type: "list",
        message: "What their managers name?",
        choices: ["Moe Mint", "Ellie Goulding", "NULL"],
      },
    ])
    .then(function (van) {});
}
