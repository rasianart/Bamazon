const inquirer    = require('inquirer');

module.exports = (repeat) => {
  inquirer.prompt({
    type: 'confirm',
    name: 'again',
    message: 'Would you like to do more?'
  }).then((confirm) => {
    if (confirm.again) {repeat()}
    else {console.log('Goodbye!'); process.exit()}
  })
}
