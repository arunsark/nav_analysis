const chalk = require('chalk')


module.exports = class Report {
    constructor() {

    }

    displayResults(schemes, months, ...returns) {
        process.stdout.write(chalk.yellowBright(Array(10).join('-')));
        schemes.forEach((_) => {
            process.stdout.write(chalk.yellowBright(Array(70).join('-')));
        });
        process.stdout.write('\n');

        process.stdout.write(chalk.greenBright('Period    '));
        schemes.forEach(function(scheme) {
            if ( scheme.length > 70 )
                scheme = scheme.substring(0, 70);
            let pad = 70 - scheme.length;
            let lpad = 0;
            let rpad = 0;
            if ( pad > 2 ) {
                lpad = Math.round(pad / 2);
                rpad = lpad;
            }
            else if ( pad == 2 ) {
                lpad = 1;
                rpad = 1;
            }
            process.stdout.write(`${Array(lpad).join(' ')}${chalk.greenBright(scheme)}${Array(rpad).join(' ')}`);
        });
        process.stdout.write('\n');

        process.stdout.write(chalk.yellowBright(Array(10).join('-')));
        schemes.forEach((_) => {
            process.stdout.write(chalk.yellowBright(Array(70).join('-')));
        });
        process.stdout.write('\n');

        months.forEach((m, index) => {
            process.stdout.write(`${chalk.yellowBright(m)}    `);
            process.stdout.write(Array(32).join(' ') + chalk.yellowBright(this.pad(returns[0][index])) + Array(32).join(' '));
            process.stdout.write(Array(32).join(' ') + chalk.yellowBright(this.pad(returns[1][index])) + Array(32).join(' '));
            process.stdout.write('\n');
        }, this);
    }

    pad(number, length=6) {
        let num = number.toFixed(2);
        while (num.length < length) {
            num = ' ' + num;
        }
        return num;
    }
}