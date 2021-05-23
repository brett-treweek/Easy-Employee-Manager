const inquirer = require("inquirer");
const mysql = require("mysql2");
// const department = require("./department");
const { promisify } = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_manager",
});

const query = promisify(connection.query).bind(connection);

// const readDepartment = async () => {
//     console.log('Selecting all products...\n');
//     const res = await query('SELECT * FROM Department' );
//     console.table(res);
//     };

//   readDepartment();

console.log(
  "========================== Welcome To Easy Employee Manager! ==========================\n"
);

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuList",
        message: "What would you like to do?",
        choices: ["View", "Add", "Update", "Delete", "Quit"],
      },
    ])
    .then((answer) => {
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
        case "Delete":
          remove();
          break;
        default:
          quit();
      }
    });
}

function quit() {
  connection.end();
  console.log('============ Application Ended ==============')
}

const view = async () => {
  const answer = await inquirer
    .prompt([
      {
        type: "list",
        name: "viewStuff",
        message: "What would you like to view?",
        choices: ["Department", "Employees", "Roles"],
      },
    ])
    .then(async (answer) => {
      const result = await query(`SELECT * FROM ${answer.viewStuff}`);
      console.table(result);
      menu();
    });
};

const add = async () => {
  const answer = await inquirer
    .prompt([
      {
        type: "list",
        name: "addStuff",
        message: "What would you like to add to?",
        choices: ["Department", "Employees", "Roles"],
      },
    ])
    .then(() => {
      addDepartment()
    });
};

const addDepartment = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the Department Name?',
      validate: (answer) => {
        if(answer === ''){
          return 'Please enter a valid name';
        }
        return true;
      }
    }
  ]).then(async (answer) => {
    const result = await query(`INSERT INTO Department\(department_name\) VALUES \('${answer.departmentName}'\)`);
    const res = await query(`SELECT * FROM Department` );
      console.log(`\n====== Created new department ${answer.departmentName} ======\n`)
      console.table(res);
      menu();
  })
};

const update = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "updateStuff",
      message: "What would you like to update?",
      choices: ["Department", "Employees", "Roles"],
    },
  ]);
  switch (answer.addStuff) {
    case "Department":
      updateDepartment();
      break;
    case "Employee":
      updateEmployees();
      break;
    default:
      updateRoles();
  }
};

const remove = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "deleteStuff",
      message: "What would you like to delete?",
      choices: ["Department", "Employees", "Roles"],
    },
  ]);
  switch (answer.addStuff) {
    case "Department":
      removeDepartment();
      break;
    case "Employee":
      removeEmployees();
      break;
    default:
      removeRoles();
  }
};

menu();

connection.connect((err) => {
  if (err) throw err;
  // console.log(`MySql connected as id ${connection.threadId}`);
});


// module.exports = menu;
