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
    name: "selection",
    type: "list",
    choices: ["View Departments","View Roles", "View Employees", "Add Department", "Exit"]
  }).then(answer => {
        switch (answer.selection) {
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