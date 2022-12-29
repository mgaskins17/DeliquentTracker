// Main Server JavaScript file
// Required list
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');

// Create a connection to the database
const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_db'
    }
)

// CRUD - CREATE READ UPDATE DELETE - INSERT SELECT UPDATE DELETE
// Connect to actual database
db.connect((err) => {
    if (err) {
        console.error(err);
    }
    console.log('Connected.')
    mainemployee() // After connecting, start up main function of choosing the options for executing
})

// Using Inquirer to list all actions listed by README - view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// BONUS: Update employee managers, view employees by manager, view employees by department, {delete departments, roles, and employees}, View the total utilized budget of a department - combined salaries of all employees in that department
function mainemployee() {
    inquirer.prompt([
        {
            type: 'list',
            choices: ['View All Departments', 
            'View All Roles', 
            'View All Employees', 
            'Add A Department', 
            'Add A Role', 
            'Add An Employee', 
            'Update An Employee Role', 
            'Quit'],
            name: 'menu'
        }
]).then((answer) => {
    switch(answer.menu) { // Using a Switch Case for which choice they select - build out separate functions where needed
        case 'View All Departments':
            view_depart();
            break;

        case 'View All Roles':
            view_roles();
            break;

        case 'View All Employees':
            view_emp();
            break;

        case 'Add A Department':
            add_depart();
            break;

        case 'Add A Role':
            add_role();
            break;

        case 'Add An Employee':

            break;

        case 'Update An Employee Role':

            break;

        case 'Quit':
            console.log(`You're done viewing and modifying the employee information.`)
            db.end();
            break;
    }
})
}



// Individual functions that will be called based off switch case
// View All Departments
function view_depart() {
    db.query('SELECT * FROM departments', (err, result) => {
        if (err) {
            console.error(err);
        }
        console.log(`\n`);
        console.table(result);
    })
    mainemployee();
}

//View All Roles
function view_roles() {
    db.query('SELECT * FROM roles', (err, result) => {
        if (err) {
            console.error(err);
        }
        console.log(`\n`);
        console.table(result);
    })
    mainemployee();
}

// View All Employees
function view_emp() {
    db.query('SELECT * FROM employees', (err, result) => {
        if (err) {
            console.error(err);
        }
        console.log(`\n`);
        console.table(result);
    })
    mainemployee();
}

// Add A Department
function add_depart() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'newdepartment'
        }
    ]).then((data) => {
        const answer = data.newdepartment;
        const sql = `INSERT INTO departments (department_name)
            VALUES (?)`;
        db.query(sql, answer, (err, result) => {
            if (err) {
                console.error(err)
            }
        })
    })
    mainemployee();
}

// Add A Role
function add_role() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the new role you would like to add?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What is the salary for this new position?',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'What is the department code for the new position?',
            name: 'department'
        }
    ]).then((data) => {
        const answer = [data.name, data.salary, data.department];
        const sql = `INSERT INTO roles (role_title, role_salary, department_id)
            VALUES (?, ?, ?)`;
        db.query(sql, answer, (err, result) => {
            if (err) {
                console.error(err)
            }
        })
    })
    mainemployee();
}

// Add An Employee
function add_employee() {

}

// Update An Employee Role
function update_employee() {

}

