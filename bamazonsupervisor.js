const mysql = require('mysql');
const inquirer = require('inquirer');
const credentials = require('./protected');
require('console.table');

const connection = mysql.createConnection({
  host     : credentials.host,
  user     : credentials.user,
  password : credentials.password,
  database : credentials.database
});

inquirer.prompt({
	type: 'list',
	name: 'options',
	message: 'Choose a supervisor tool.',
	choices: ['View Product Sales by Department', 'Create New Department']
}).then((choice) => {
	if (choice.options === 'View Product Sales by Department') {
		connection.query('SELECT *, total_sales - over_head_costs AS total_profit FROM departments', (err, rows, fields) => {
			if (err) throw err;
			console.table('Product Sales by Department', rows);
		});
	} else {
		inquirer.prompt([{
			type: 'input',
			name: 'name',
			message: 'Please enter the name of the department you would like to create.'
		},{
			type: 'input',
			name: 'costs',
			message: 'Please enter the overhead costs of this department.'
		}]).then((create) => {
			connection.query('INSERT INTO departments SET ?', {department_name: create.name, 
															   over_head_costs : create.costs,
															   total_sales: 0}, (err) => {
			  if (err) throw err;
			  console.log('Successfully inserted.');
			  // process.exit();
			});
		});
	}
});