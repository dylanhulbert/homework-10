const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runApp();
});

function runApp() {
  inquirer.prompt({
    name: "Options",
    type: "list",
    choices: ["View Departments","View Roles", "View Employees", "Add Department", "Add Roles", "Exit"]
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
      message: "What title:"
      }, 
      {
      name: "salary",
      type: "input",
      message: "What salary:"
      }, 
      {
      name: "department",
      type: "list",
      message: "What department:",
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
          });
      })
  });
}