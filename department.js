const inquirer = require("inquirer");
const mysql = require("mysql2");
const { promisify } = require("util");
const index = require("./index");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_manager",
});
const query = promisify(connection.query).bind(connection);

function department(department_name) {
  this.department_name = department_name;

  this.addDepartment = async () => {
    const answer = await inquirer
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
        const result = await query(
          `INSERT INTO Department\(department_name\) VALUES \('${answer.departmentName}'\)`
        );
        const res = await query(`SELECT * FROM Department`);
        console.log(
          `\n====== Created new department ${answer.departmentName} ======\n`
        );
        console.table(res);
        
      })
    }};


module.exports = department;
