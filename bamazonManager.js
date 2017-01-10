const mysql = require('mysql');
const inquirer = require('inquirer');
const credentials = require('./protected');

const connection = mysql.createConnection({
  host     : credentials.host,
  user     : credentials.user,
  password : credentials.password,
  database : credentials.database
});

inquirer.prompt({
	type: 'list',
	name: 'options',
	message: 'Choose a management tool.',
	choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}).then((choice) => {
	if (choice.options === 'View Products for Sale') {
		connection.query('SELECT * FROM products', (err, rows, fields) => {
			if (err) throw err;
			let propValue;
			rows.forEach((itm) => {
				for(let propName in itm) {
		    		propValue = itm[propName]
		    		console.log(propName + ": " + propValue);
				}
				console.log('---------------');
			})
		});
		process.exit();
	} else if (choice.options === 'View Low Inventory') {
		connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, rows, fields) => {
			if (err) throw err;
			let propValue;
			rows.forEach((itm) => {
				for(let propName in itm) {
		    		propValue = itm[propName]
		    		console.log(propName + ": " + propValue);
				}
				console.log('---------------');
			})
			process.exit();
		});
	} else if (choice.options === 'Add to Inventory') {
		inquirer.prompt([{
			type: 'input',
			name: 'id',
			message: 'Please enter the ID of the item you would like to replenish.'
		},{
			type: 'input',
			name: 'amount',
			message: 'Please enter the new total amount of the item you would like to have in stock.'
		}]).then((add) => {
			connection.query('UPDATE products SET stock_quantity = ? where item_id = ?', [add.amount, add.id], (err) => {
				if (err) throw err;
				console.log('Updated succesfully');
				process.exit();
			});
		})	
	} else {
		inquirer.prompt([{
			type: 'input',
			name: 'name',
			message: 'Please enter the name of the item you would like to add.'
		},{
			type: 'input',
			name: 'price',
			message: 'Please enter the price of the item you would like to add.'
		},{
			type: 'input',
			name: 'amount',
			message: 'Please enter the amount of the item you would like to add.'
		},{
			type: 'input',
			name: 'department',
			message: 'Please enter the department of the item you would like to add.'
		}]).then((newProduct) => {
			connection.query('INSERT INTO products SET ?', {product_name: newProduct.name, 
															price : newProduct.price,
															stock_quantity: newProduct.amount,
															department_name: newProduct.department}, (err) => {
			  if (err) throw err;
			  console.log('Successfully inserted.');
			  process.exit();
			});
		});
	}
})




