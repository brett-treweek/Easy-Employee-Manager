DROP DATABASE IF EXISTS employee_manager;

CREATE DATABASE employee_manager;

set foreign_key_checks=0;

USE employee_manager;

CREATE TABLE Department (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL 
);

CREATE TABLE Employees (
    id INT AUTO_INCREMENT NOT NULL, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    CONSTRAINT FK_EmployeeRole FOREIGN KEY(role_id)
    REFERENCES Roles (id),
    CONSTRAINT FK_EmployeeManager FOREIGN KEY(manager_id)
    REFERENCES Employees(id)
);

CREATE TABLE Roles  (
    id INT NOT NULL AUTO_INCREMENT ,
    title VARCHAR(30),
    salary DECIMAL, 
    department_id INT,
    PRIMARY KEY (id),
    CONSTRAINT FK_RoleDepartment 
    FOREIGN KEY(department_id)
    REFERENCES Department(id)
    );

INSERT INTO Department ( department_name)
VALUES ('Front Office');
INSERT INTO Department (department_name)
VALUES ('Food and Beverages');
INSERT INTO Department (department_name)
VALUES ('Sales and Marketing');

INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Daenerys', 'Targaryen', 1, NULL);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Jon', 'Snow', 2, NULL);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Night', 'King', 3, NULL);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Khal', 'Drogo', 4, 1);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Jorah', 'Mormont', 5, 1);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Samwell', 'Tarly', 6, 2);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Sansa', 'Stark', 7, 2);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Cersei', 'Lannister', 8, 3);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Walder', 'Frey', 9, 3);

INSERT INTO Roles (id, title, salary, department_id)
VALUES (1, 'Director of Rooms', '150000', 1);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (4, 'Front Office Manager', '90000', 1);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (5, 'Receptionist', '40000', 1);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (2, 'Director of Food and Beverages', '150000', 2);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (6, 'Chef', '65000', 2);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (7, 'Waitress', '40000', 2);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (3, 'Director of Sales', '15000', 3);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (8, 'Events Co-ordinator', '75000', 3);
INSERT INTO Roles (id, title, salary, department_id)
VALUES (9, 'Sales Co-ordinator', '75000', 3);

SELECT * FROM Employees
