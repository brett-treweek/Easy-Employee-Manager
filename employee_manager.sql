CREATE DATABASE employee_manager;

USE employee_manager;

CREATE TABLE Department (
    id INT PRIMARY KEY ,
    department_name VARCHAR(30)
);
CREATE TABLE Employees (
    id INT PRIMARY KEY ,
    department_name VARCHAR(30)
);
CREATE TABLE Roles  (
    id INT PRIMARY KEY ,
    department_name VARCHAR(30)
);

INSERT INTO Department (id, department_name)
VALUES (2, 'sales');