const inquirer = require("inquirer");
const mysql = require("mysql2");
const { promisify } = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_manager",
});

// const query = promisify(connection.query).bind(connection);



// const readDepartment =async () => {
//     console.log('Selecting all products...\n');
//     const res = await query('SELECT * FROM Department' );
//     console.table(res);
//     };

//   readDepartment();

const menuList = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "menuList",
      message: "What would you like to do?",
      choices: ["View", "Add", "Update"],
    },
  ]);

  switch (answer.menuList) {
    case "View":
      view();
      break;
    case "Add":
      add();
      break;
    case "Update":
      update();
      break;
  }
};

const add = async () => {
const answer = await inquirer.prompt([
  {
    type: "list",
    name: "addStuff",
    message: "what would you like to add?",
    choices: ["department", "employee", "role"],
  },
]);
switch (answer.addStuff) {
  case "department":
    createDepartment();
    break;
  case "employee":
    createEmployees();
    break;
  default:
    createRoles();
}};

menuList();
// function view() {}
// function update() {}


connection.connect((err) => {
    if(err) throw err;
    // console.log(`MySql connected as id ${connection.threadId}`);
});