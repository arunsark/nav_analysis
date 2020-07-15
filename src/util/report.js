const chalk = require('chalk')


module.exports = class Report {
    constructor() {
        this.colLength = 60;
    }

    displayResults(schemes, months, ...returns) {
        process.stdout.write(chalk.yellowBright(Array(10).join('-')));
        schemes.forEach((_) => {
            process.stdout.write(chalk.yellowBright(Array(this.colLength).join('-')));
        });
        process.stdout.write('\n');

        process.stdout.write(chalk.greenBright('Period    '));
        schemes.forEach(function(scheme) {
            process.stdout.write(this.paddedText(scheme, this.colLength, chalk.greenBright));
        }, this);
        process.stdout.write('\n');

        process.stdout.write(chalk.yellowBright(Array(10).join('-')));
        schemes.forEach((_) => {
            process.stdout.write(chalk.yellowBright(Array(this.colLength).join('-')));
        });
        process.stdout.write('\n');

        process.stdout.write(chalk.yellowBright(Array(10).join(' ')));
        schemes.forEach((_) => {
            process.stdout.write(this.paddedText('Rolling', 30, chalk.redBright));
            process.stdout.write(this.paddedText('Trailing', 30, chalk.redBright));
        });
        process.stdout.write('\n');

        process.stdout.write(chalk.yellowBright(Array(10).join(' ')));
        schemes.forEach((_) => {
            process.stdout.write(chalk.yellowBright(Array(this.colLength).join('-')));
        });
        process.stdout.write('\n');

        months.forEach((m, index) => {
            process.stdout.write(`${chalk.yellowBright(m)}    `);
            // process.stdout.write(Array(this.numPad).join(' ') + chalk.yellowBright(this.pad(returns[0]['rolling'][index])) + Array(this.numPad).join(' '));
            // process.stdout.write(Array(this.numPad).join(' ') + chalk.yellowBright(this.pad(returns[1]['rolling'][index])) + Array(this.numPad).join(' '));
            schemes.forEach((_, scheme) => {
                process.stdout.write(this.paddedText(this.formatNumber(returns[scheme]['rolling'][index]), 30, chalk.yellowBright));
                process.stdout.write(this.paddedText(this.formatNumber(returns[scheme]['trailing'][index]), 30, chalk.yellowBright));
            });
            process.stdout.write('\n');
        }, this);
    }

    formatNumber(number, length=6) {
        let num = number.toFixed(2);
        while (num.length < length) {
            num = ' ' + num;
        }
        return num;
    }

    paddedText(text, colLength, chalkFn) {
        if ( text.length > colLength )
            text = text.substring(0, colLength);
        let pad = colLength - text.length;
        if ( pad > 2 )
            pad = Math.round(pad / 2);
        else if ( pad == 2 )
            pad = 1;

        if ( chalkFn )
            text = chalkFn.call(this, text);

        return `${Array(pad).join(' ')}${text}${Array(pad).join(' ')}`;
    }
}