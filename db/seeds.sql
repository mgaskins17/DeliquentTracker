USE business_db

INSERT INTO departments (department_name)
VALUES 
("Engineering")
("Human Resources")
("Legal")
("Finance")


INSERT INTO roles (role_title, role_salary, department_id)
VALUES
("Mechanical Engineer", 105000, 1)
("Electrical Engineer", 110000, 1)
("Recruiter", 70000, 2)
("Civil Engineer", 95000, 1)
("Attorney", 150000, 3)
("Cost Controller", 80000, 4)

INSERT INTO managers (first_name, last_name)
VALUES
("Byron", "Ferguson") -- Human Resources
("Dwayne", "Johnson") -- Legal
("Paul", "Walker") -- Engineering
("Warren", "Buffet") -- Finance

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Matthew", "Gaskins", 1, 3)
("Shannon", "Mckim", 5, 2)
("Nymphadora", "Tonks", 3, 1)
