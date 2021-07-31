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
          "View All Departments",
          "View All Roles",
          "Add Role",
          "Add Department",
          "Add Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choices) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;
      }
    });
};

const viewAllEmployees = () => {
  const sql = `select emp.id, emp.first_name, emp.last_name, emp.title, emp.salary, emp.department_name, CONCAT(mng.first_name, CONCAT (' ', mng.last_name)) AS manager from (select emp.id, emp.first_name, emp.last_name, rl.title, rl.salary, dpt.department_name, emp.manager_id from employee emp join roles rl join department dpt on emp.role_id = rl.id AND rl.department_id = dpt.id) emp left join employee mng on emp.manager_id = mng.id;`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const employeeByDepartment = () => {
  const sql = `select emp.first_name, emp.last_name, dpt.department_name from employee emp join roles rl join department dpt on emp.role_id = rl.id AND rl.department_id = dpt.id;`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const viewAllDepartments = () => {
  const sql = `SELECT * FROM department;`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const viewAllRoles = () => {
  const sql = `SELECT rl.title, rl.id, dept.department_name, rl.salary FROM roles rl JOIN department dept ON rl.department_id = dept.id;`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.table(result);
    prompt();
  });
};

const addRole = () => {
  getAllDepartments().then((departments) => {
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the role: ",
          validate: (addTitle) => {
            if (addTitle) {
              return true;
            } else {
              console.log("Please enter a title");
              return false;
            }
          },
        },
        {
          name: "salary",
          type: "input",
          message: "What is this roles salary?",
          validate: (addSalary) => {
            const salary = Number(addSalary);

            if (!isNaN(salary)) {
              return true;
            } else {
              console.log("Please enter a Salary");
              return false;
            }
          },
        },
        {
          name: "department",
          type: "list",
          message: "What is the associated department for this role?",
          choices: departments,
        },
      ])

      .then((val) => {
        let deptIdPromise = db
          .promise()
          .query(
            `SELECT id FROM department WHERE department_name = '${val.department}'`
          )
          .then(([rows, fields]) => {
            return rows[0].id;
          });
        deptIdPromise
          .then((departmentId) => {
            sql = `INSERT INTO roles SET ?;`;
            db.query(
              sql,
              {
                title: val.title,
                salary: val.salary,
                department_id: departmentId,
              },
              function (err) {
                if (err) throw err;
              }
            );
          })
          .then(() => {
            prompt();
          });
      });
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "departmentname",
        type: "input",
        message: "Enter the department name: ",
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("Please enter a department name");
            return false;
          }
        },
      },
    ])
    .then((val) => {
      sql = `INSERT INTO department SET?;`;
      db.query(sql, { department_name: val.departmentname });
    })
    .then(() => {
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

const getAllRoles = () => {
  const sql = `SELECT title FROM roles;`;
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let roles = [];
      for (var i in rows) roles.push(rows[i].title);
      return roles;
    });
};

const getAllDepartments = () => {
  const sql = `SELECT department_name FROM department;`;
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let departments = [];
      for (var i in rows) departments.push(rows[i].department_name);
      return departments;
    });
};

const getRoleId = (role) => {
  return db
    .promise()
    .query(`SELECT id FROM roles WHERE title = '${role}'`)
    .then(([rows, fields]) => {
      return rows[0].id;
    });
};

const getManagerId = (manager) => {
  return db
    .promise()
    .query(
      `SELECT id FROM employee WHERE CONCAT(first_name, CONCAT(' ', last_name)) = '${manager}'`
    )
    .then(([rows, fields]) => {
      return rows[0].id;
    });
};

function addEmployee() {
  getAllRoles().then((roles) => {
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
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "What their managers name?",
            choices: managers,
          },
        ])
        .then((val) => {
          let roleIdPromise = getRoleId(val.role);
          let managerIdPromise = getManagerId(val.manager);
          roleIdPromise.then((roleId) => {
            managerIdPromise.then((managerId) => {
              const sql = `INSERT INTO employee SET ?`;
              db.query(
                sql,
                {
                  first_name: val.firstname,
                  last_name: val.lastname,
                  role_id: roleId,
                  manager_id: managerId,
                },
                function (err) {
                  if (err) throw err;
                }
              );
            });
          });
        })
        .then(() => {
          prompt();
        });
    });
  });
}

getAllEmpoyees = () => {
  const sql = `SELECT CONCAT(first_name, CONCAT(' ', last_name)) as full_name FROM Employee order by first_name, last_name asc`;
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      let employees = [];
      for (var i in rows) employees.push(rows[i].full_name);
      return employees;
    });
};

const removeEmployee = () => {
  getAllEmpoyees().then((employees) => {});
};

const updateEmployeeRole = () => {
  getAllEmpoyees().then((employees) => {
    getAllRoles().then((roles) => {
      inquirer
        .prompt([
          {
            name: "employeename",
            type: "list",
            message: "Select employee to update role:",
            choices: employees,
          },
          {
            name: "role",
            type: "list",
            message: "Select a new role: ",
            choices: roles,
          },
        ])
        .then((val) => {
          let roleIdPromise = getRoleId(val.role);
          roleIdPromise.then((roleId) => {
            sql = `UPDATE employee SET role_id = '${roleId}' WHERE CONCAT(first_name, CONCAT(' ', last_name)) = '${val.employeename}';`;
            db.query(sql);
          });
        })
        .then(() => {
          prompt();
        });
    });
  });
};
