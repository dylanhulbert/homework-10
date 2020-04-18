const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker"
})

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runApp();
})

function runApp() {
  inquirer.prompt({
    name: "Options",
    type: "list",
    choices: ["View Departments","View Roles", "View Employees", "Add Department", "Add Roles", "Update Roles", "Exit"]
  }).then(answer => {
        switch (answer.Options) {
          case "View Departments":
          viewDepartments();
          break;
          case "View Roles":
          viewRoles();
          break;
          case "View Employees":
          viewEmployees();
          break;
          case "Add Department":
          addDepartment();
          break;
          case "Add Roles":
          addRoles();
          break;
          case "Update Roles":
          updateRoles();
          break;
          case "Exit":
          process.exit();
        }
      })
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    runApp();
  })
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    runApp();
  })
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    runApp();
  })
}

function addDepartment() {
  inquirer.prompt({
    name: "addDepartment",
    type: "input",
    message: "Add Department:"
  }).then(answer => {
      let query = `INSERT INTO department (name) VALUES ("${answer.addDepartment}");`;
      connection.query(query, function (err, res) {
        if (err) throw err;
        runApp();
      })
  })
}

function addRoles() {
  const query = `SELECT name FROM department`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
      name: "title",
      type: "input",
      message: "What Title:"
      }, 
      {
      name: "salary",
      type: "input",
      message: "What Salary:"
      }, 
      {
      name: "department",
      type: "list",
      message: "What Department:",
      choices: res
      }
      ]).then(answer => {
          console.log(answer.department);
          const query = `SELECT id FROM department WHERE name = "${answer.department}";`;
          connection.query(query, function (err, res) {
            if (err) throw err;
            const savedId = res[0].id;
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", ${answer.salary}, ${savedId});`, function (err, res) {
            runApp();
            })
          })
      })
  })
}

function updateRoles() {
  connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;`, function (err, res) {
    if (err) throw err;
    inquirer.prompt({
      name: "employee",
      type: "list",
      message: "Which Employee:",
      choices: res
      }).then(answer => {
          connection.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.employee}";`, function (err, res) {
            if (err) throw err;
            const employeeId = res[0].id;
            const query = `SELECT title FROM role`;
            connection.query(query, function (err, res) {
              if (err) throw err;
              let choicesArray = res.map(item => { return item.title });
              inquirer.prompt({
                name: "newRole",
                type: "list",
                message: "Which Role:",
                choices: choicesArray
                }).then(answer => {
                    const query = `SELECT id FROM role WHERE title = "${answer.newRole}";`;
                    connection.query(query, function (err, res) {
                      if (err) throw err;
                      const roleId = res[0].id;
                      const query = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`
                      connection.query(query, function (err, res) {
                        if (err) throw err;
                        runApp();
                      })
                    })
                  })
            })
          })
        })
  })
}