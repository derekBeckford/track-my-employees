const mysql = require("mysql2");
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
  const sql = `select emp.first_name, emp.last_name, rl.title, rl.salary, dpt.department_name, CONCAT(mng.first_name, CONCAT (' ', mng.last_name)) AS manager from employee emp join employee mng join roles rl join department dpt on emp.manager_id = mng.id and emp.role_id = rl.id AND rl.department_id = dpt.id;`;
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

const getAllManagers = () => {
  const sql = `SELECT CONCAT(first_name, CONCAT(' ', last_name)) as full_name FROM Employee order by first_name, last_name asc`;
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let managers = [];
      for (var i in rows) managers.push(rows[i].full_name);
      return managers;
    });
};

function addEmployee() {
  getAllManagers().then((managers) => {
    inquirer
      .prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name",
          validate: (addFirstName) => {
            if (addFirstName) {
              return true;
            } else {
              console.log("Please enter a first name");
              return false;
            }
          },
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name",
          validate: (addLastName) => {
            if (addLastName) {
              return true;
            } else {
              console.log("Please enter a last name");
              return false;
            }
          },
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
          name: "manager",
          type: "list",
          message: "What their managers name?",
          choices: managers,
        },
      ])
      .then((val) => {
        let roleIdPromise = db
          .promise()
          .query(`SELECT id FROM roles WHERE title = '${val.role}'`)
          .then(([rows, fields]) => {
            return rows[0].id;
          });
          // let managerIdPromise = db
          // .promise()
          // .query(`SELECT id FROM employee where `)
        roleIdPromise.then((roleId) => {
          const sql = `INSERT INTO employee SET ?`;
          db.query(
            sql,
            {
              first_name: val.firstname,
              last_name: val.lastname,
              role_id: roleId,
              //manager_id: val.manager,
            },
            function (err) {
              if (err) throw err;
              //console.table(val);

              //prompt();
            }
          );
        });
      });
  });
}
