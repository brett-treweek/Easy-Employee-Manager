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
function byManagerFunction(managerArray) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "manager",
        message: "Which managers minions would you like to view?",
        choices: managerArray,
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ])
    .then(async (answer) => {
      const result = await query(
        `select employees.first_name as 'Name', employees.last_name as Surname, roles.title as Position, roles.salary as Salary from employees inner join roles on employees.role_id=roles.id where manager_id=${answer.manager}`
      );
      console.table(result);
      menu();
    });
}

async function totalBudgetFunction() {
  const allDepts = await query(`select *
  from department`);

  allDepts.forEach(async (element) => {
    let id = element.id;

    const dept = await query(`select * 
  from ((roles
  inner join employees on roles.id=employees.role_id)
  inner join department on department.id=roles.department_id)
  where department_id=${id};`);

    const deptBudget = dept.map((dep) => {
      return {
        name: dep.department_name,
        value: dep.salary,
      };
    });
    const sum = deptBudget
      .map((item) => parseInt(item.value))
      .reduce((prev, curr) => prev + curr, 0);

    console.log(deptBudget[0].name, sum);
  });
}

function view() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewStuff",
        message: "What would you like to view?",
        choices: [
          "Employees",
          "Department",
          "Roles",
          "Employees by Manager",
          "Total Budget of Departments",
          "Back",
        ],
      },
    ])
    .then(async (answer) => {
      switch (answer.viewStuff) {
        case "Employees":
          const result =
            await query(`SELECT Employees.id as ID, Employees.first_name as 'First Name', Employees.last_name as Surname, Roles.title as Position, Roles.salary as Salary, Department.department_name as Department, Employees.manager_id as 'Manager ID'
        FROM ((Roles 
        INNER JOIN Employees ON Roles.id=Employees.role_id) 
        INNER JOIN Department ON Roles.department_id=Department.id)`);
          console.table(result);
          menu();
          break;

        case "Employees by Manager":
          const managers = await query(
            `SELECT first_name, last_name, id FROM Employees WHERE role_id='1' OR role_id='2' OR role_id='3'`
          );
          const managerArray = managers.map((manager) => {
            return {
              name: manager.first_name + " " + manager.last_name,
              value: manager.id,
            };
          });
          byManagerFunction(managerArray);
          break;

        case "Back":
          menu();
          break;

        case "Total Budget of Departments":
          totalBudgetFunction();
          break;

        default:
          const res = await query(`SELECT * FROM ${answer.viewStuff}`);
          console.table(res);
          menu();
          break;
      }
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
        choices: ["Department", "Employees", "Roles", "Back"],
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
        case "Back":
          menu();
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

async function addEmployees() {
  // Creating array of managers ===============
  const managers = await query(
    `SELECT first_name, last_name, id FROM Employees WHERE role_id='1' OR role_id='2' OR role_id='3'`
  );

  const managerArray = managers.map((manager) => {
    return {
      name: manager.first_name + " " + manager.last_name,
      value: manager.id,
    };
  });

  const roles = await query("select * from roles");
  const rolesArray = roles.map((role) => {
    return {
      name: role.title,
      value: role.id,
    };
  });

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
        choices: rolesArray,
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
      employeeAnswers(answer);
    });
}

async function employeeAnswers(answer) {
  await query(
    `INSERT INTO Employees\(first_name, last_name, role_id, manager_id\) VALUES \('${answer.FirstName}','${answer.Surname}','${answer.roleId}', '${answer.managerId}'\)`
  );
  const res = await query(`SELECT * FROM Employees`);
  console.log(
    `\n====== Created new Employee ${answer.FirstName} ${answer.Surname} ======\n`
  );
  console.table(res);
  menu();
}

// =================== Add Role Question ========================
async function addRoles() {
  const deptArray = await query("select * from department");
  const deptList = deptArray.map((dept) => {
    return {
      name: dept.department_name,
      value: dept.id,
    };
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the new Role Name?",
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the new Role's base salary?",
        validate: (answer) => {
          if (answer === NaN) {
            return "Please enter a valid number";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "departmentId",
        message: "What is the new Role's Department id?",
        choices: deptList,
        validate: (answer) => {
          if (answer === "") {
            return "Please enter a valid name";
          }
          return true;
        },
      },
    ])
    .then(async (answer) => {
      console.log(answer);
      await query(
        `INSERT INTO Roles\(title, salary, department_id\) VALUES \('${answer.title}', ${answer.salary}, ${answer.departmentId}\)`
      );
      const res = await query(`SELECT * FROM Roles`);
      console.log(`\n====== Created new Role ${answer.title} ======\n`);
      console.table(res);
      menu();
    });
}

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
  switch (answer.updateStuff) {
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
