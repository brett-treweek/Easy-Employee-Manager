CREATE DATABASE employee_manager;

set foreign_key_checks=0;

USE employee_manager;

CREATE TABLE Department (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL 
);

CREATE TABLE Employees (
    id INT AUTO_INCREMENT,
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
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL, 
    department_id INT,
    PRIMARY KEY (id),
    CONSTRAINT FK_RoleDepartment 
    FOREIGN KEY(department_id)
    REFERENCES Department(id)
    );

INSERT INTO Department ( department_name)
VALUES ('sales');
INSERT INTO Department (department_name)
VALUES ('marketing');
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Brett', 'Treweek', 2, 345);
INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ('Marion', 'Faitg', 1, 345);
INSERT INTO Roles (title, salary, department_id)
VALUES ('Bossy Boots', '50500', 1);
INSERT INTO Roles (title, salary, department_id)
VALUES ('Donkey', '600', 2);
