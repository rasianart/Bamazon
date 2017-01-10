const mysql = require('mysql');
const inquirer = require('inquirer');
const credentials = require('./protected');

const connection = mysql.createConnection({
  host     : credentials.host,
  user     : credentials.user,
  password : credentials.password,
  database : credentials.database
});

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
	run();
});

const run = () => {
	inquirer.prompt([{
		type: 'input',
		name: 'id',
		message: 'Please enter the ID of the item you would like to purchase.'
	},{
		type: 'input',
		name: 'units',
		message: 'Please enter the number of units of this item you would like to purchase.'
	}]).then((id) => {
		connection.query('SELECT * FROM products where item_id = ?', id.id, (err, rows, fields) => {
			if (err) throw err;
			console.log(rows);
			if (id.units > rows[0].stock_quantity) {
				console.log('Insufficient Quantity.');
				process.exit(); 
			} else {
				let newQuantity = rows[0].stock_quantity - id.units;
				let newPrice = id.units * rows[0].price;
				connection.query('UPDATE products SET stock_quantity = ? where item_id = ?', [newQuantity, id.id], (err) => {
					if (err) throw err;
					console.log('Updated succesfully');
				});
				console.log('Your total price is $' + newPrice);
				process.exit();
			}
		});
	});
}

