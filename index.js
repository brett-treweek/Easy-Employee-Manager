// ================ Required Dependencies =================
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { promisify } = require("util");

// ================ Connection to MySQL parameters ==================
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_manager",
});

const query = promisify(connection.query).bind(connection);

// ================ Welcome Message ====================
console.log(
  "========================== Welcome To Easy Employee Manager! ==========================\n"
);

// ================ Inital Question ===================
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

// ==================================================================
// ===================== View Tables Function =======================
function view() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewStuff",
        message: "What would you like to view?",
        choices: [
          "Department",
          "Employees",
          "Roles",
          "Employees by Manager",
          "Total Budget of Departments",
        ],
      },
    ])
    .then(async (answer) => {
      const result = await query(`SELECT * FROM ${answer.viewStuff}`);
      console.table(result);
      menu();
    });
}

// =============================================================
// ===================== Add Question ==========================
function add() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "addStuff",
        message: "What would you like to add?",
        choices: ["Department", "Employees", "Roles"],
      },
    ])
    .then((answer) => {
      switch (answer.addStuff) {
        case "Department":
          addDepartment();
          break;
        case "Employees":
          addEmployees();
          break;
        case "Roles":
          addRoles();
          break;
      }
    });
}
// ================= Add Department Question =================

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the Department Name?",
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ])
    .then(async (answer) => {
      await query(
        `INSERT INTO Department\(department_name\) VALUES \('${answer.departmentName}'\)`
      );
      const res = await query(`SELECT * FROM Department`);
      console.log(
        `\n====== Created new department ${answer.departmentName} ======\n`
      );
      console.table(res);
      menu();
    });
}

// =================== Add Employee Question ====================

// Return list of managers for manager question, set them to variable, set variable as choices in question.

async function addEmployees() {
  const managers = await query(
    `SELECT first_name, last_name, id FROM Employees WHERE role_id='1'`
  );
  
  console.log(managers)
  const managerArray = [];

  managers.forEach((element) => {
    managerArray.push(`${element.first_name} ${element.last_name}`);
  });

  console.log(managerArray);

  inquirer
    .prompt([
      {
        type: "input",
        name: "FirstName",
        message: "What is the Employees First Name?",
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "Surname",
        message: "What is the Employees Surname?",
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the Employees Role?",
        choices: [
          "Manager",
          "Lead Engineer",
          "Junior Engineer",
          "Administration",
        ],
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the new employees Manager?",
        choices: managerArray,
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      
      if (answer.roleId === 'Manager') {
        role = 1
      } else if (answer.roleId === 'Lead Engineer') {
        role = 2
      } else if (answer.roleId === 'Junior Engineer') {
        role = 3
      } else role = 4;

      console.log(answer, role);
      console.log(answer.managerId)
      employeeAnswers(answer, role);
    });
}

async function employeeAnswers(answer, role) {
  console.log(role);
  
  let mngrArray = []
  const mngr = answer.managerId.split(' ')
  mngrArray.push(mngr)
  mngrArray = mngrArray.shift()
  console.log('mngrArray: ',mngrArray)
  const managersFirstName = mngrArray.shift()
  const managersLastName = mngrArray.shift()
  console.log("managersFirstName: ",managersFirstName)
  console.log("managersLastName: ",managersLastName)
  const managersPK = await query(
    `SELECT id FROM Employees WHERE first_name='${managersFirstName}' AND last_name='${managersLastName}'`
  );
  console.log(managersPK)
  const managersPKID = managersPK[0].id


  await query(
    `INSERT INTO Employees\(first_name, last_name, role_id, manager_id\) VALUES \('${answer.FirstName}','${answer.Surname}','${role}', '${managersPKID}'\)`
  );
  const res = await query(`SELECT * FROM Employees`);
  console.log(
    `\n====== Created new Employee ${answer.FirstName} ${answer.Surname} ======\n`
  );
  console.table(res);
  menu();
}

// =================== Add Role Question ========================

// ========================================================
// ================= Update Question ======================
const update = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "updateStuff",
      message: "What would you like to update?",
      choices: ["Employee Roles", "Employee Managers"],
    },
  ]);
  switch (answer.addStuff) {
    case "Department":
      updateEmployeeRoles();
      break;
    case "Employee":
      updateEmployeeManagers();
      break;
  }
};
// ================== Update Employee Roles =====================
// ================== Update Employee Managers ======================

// ==========================================================
// ================== Delete Question =======================
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
// =================== Delete Department =======================
// =================== Delete Employees =======================
// =================== Delete Roles ===========================

// =================== Quit Application Function =====================
function quit() {
  connection.end();
  console.log("============ Application Ended ==============");
}

// ================== Calling Initial Question =====================
menu();

// =================== MYSQL Connection Function ==================
connection.connect((err) => {
  if (err) throw err;
  // console.log(`MySql connected as id ${connection.threadId}`);
});
