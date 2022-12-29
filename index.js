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
    console.log(` _____                 _                         __   __                                   
                 | ____|_ __ ___  _ __ | | ___  _   _  ___  ___  |   V   | __ _ _ __   __ _  __ _  ___ _ __ 
                 |  _| | '_ ' _  | '_ '| |/ _ '| | | |/ _ |/ _ | | | v | |/ _' | '_  |/ _' |/ _' |/ _ | '__|
                 | |___| | | | | | |_) | | (_) | |_| |  __/  __/ | |   | | (_| | | | | (_| | (_| |  __/ |   
                 |_____|_| |_| |_| .__/|_| ___/'.__, | ___| ___| |_|   |_| __,_|_| |_| __,_| __, | ___|_|   
                                 |_|            |___/                                       |___/           `);
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
            add_employee();
            break;

        case 'Update An Employee Role':
            update_employee();
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
        view_depart();
    })
}

// Add A Role
function add_role() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.error(err)
        }

        const departlist = results.map(({ department_name, id}) => ({name: department_name, value: id}));
    
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
                type: 'list',
                message: 'What is the department code for the new position?',
                choices: departlist, 
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
            view_roles();
        })
    })
}

// Add An Employee
function add_employee() {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error(err)
        }

        const rolelist = results.map(({ role_title, id}) => ({name: role_title, value: id}));

        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name of the new employee?',
                name: 'first_name'
            },
            {
                type: 'input',
                message: 'What is the last name of the new employee?',
                name: 'last_name'
            },
            {
                type: 'list',
                message: 'What is the rode for the new employee?',
                choices: rolelist,
                name: 'role_id'
            },
            {
                type: 'input',
                message: 'What is the id of the manager the employee is assigned to?',
                name: 'manager_id'
            }
        ]).then((data) => {
            const answer = [data.first_name, data.last_name, data.role_id, data.manager_id];
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
            db.query(sql, answer, (err, result) => {
                if (err) {
                    console.error(err)
                }
            })
            view_emp();
        })
    })
}

// Update An Employee Role
function update_employee() {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            console.error(err)
        }
        const employeelist = results.map(({ id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: employeelist,
                name: 'employees'
            }
        ]).then((data) => {
            const selectedemployee = data.employees;
            const selection = [];
            selection.push(selectedemployee);

            // Query to obtain roles from roles table
            db.query('SELECT * FROM roles', (err, results) => {
                if (err) {
                    console.error(err);
                }
                
                // creating choices for the inquirer list, but only the value is stored
                const rolelist = results.map(({ role_title, id}) => ({name: role_title, value: id}));
                console.log(rolelist)
                // New Inquirer for selecting what their new role is
                inquirer.prompt([
                    {
                        type: 'list',
                        message: `What is the employee's new role?`,
                        choices: rolelist,
                        name: 'roles'
                    }
                ]).then((data) => {
                    const selectedrole = data.roles;
                    selection.push(selectedrole); // selection contains the values from the inquirer questions
                    
                    // Final db query for completing the update
                    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                    db.query(sql, selection, (err, result) => {
                        if (err) {
                            console.error(err)
                        }

                        view_emp();
                    })
                })
            })
        })
    }
)}
