const HistoricalData = require('./historicalData.js')
var isBefore = require('date-fns/isBefore')
var isEqual = require('date-fns/isEqual')
var addMonths = require('date-fns/addMonths')
var addDays = require('date-fns/addDays')
var format = require('date-fns/format')

module.exports = class MovingAverage {
    constructor(data) {
        this.history = HistoricalData.create(data);
        this.months = [];
    }

    static create(data) {
        return new MovingAverage(data);
    }

    computeReturns(periodOfInvestment, horizon) {
        let returns = [];
        let monthReturns = [];
        let installmentDate = this.findStartDateOfInvestment(horizon);

        let lastInstallmentDate = addMonths(installmentDate, (horizon-periodOfInvestment));
        let month = this.extractMonthFromDate(installmentDate, periodOfInvestment);

        while ( isBefore(installmentDate, lastInstallmentDate) || isEqual(installmentDate, lastInstallmentDate) ) {
            let returnForAnInvestment = this.computeReturnsForAnInvestment(installmentDate, periodOfInvestment);
            if ( returnForAnInvestment !== null )
                monthReturns.push(returnForAnInvestment);
            installmentDate = addDays(installmentDate, 1);
            if ( month !== this.extractMonthFromDate(installmentDate, periodOfInvestment) ) {
                this.months.push(month);
                returns.push(this.averageReturnsForInstallment(monthReturns));
                month = this.extractMonthFromDate(installmentDate, periodOfInvestment);
                monthReturns = [];
            }
        }
        this.months.push(month);
        returns.push(this.averageReturnsForInstallment(monthReturns));
        // console.log(returns);
        return returns;
    }

    getMonths() {
        return this.months;
    }

    extractMonthFromDate(date, period) {
        return format(addMonths(date, period), 'MMM-yy');
    }

    averageReturnsForInstallment(monthReturns) {
        if ( monthReturns.length == 0 )
            return 0;
        const sum = monthReturns.reduce( (accumlator, currentValue) => accumlator + currentValue );
        // console.log('AVG '+month+ ' ' + sum+ ' '+monthReturns.length);
        return Math.round((sum/monthReturns.length)*100)/100;
    }

    computeReturnsForAnInvestment(startDate, period) {
        let startNav = this.history.getNav(startDate);
        let endDate = addMonths(startDate, period);
        let endNav = this.history.getNav(endDate);
        if ( startNav == null || endNav == null )
           return null;
        // console.log('NAVS '+startDate+ ' '+ endDate+ ' ' +startNav+ ' ' +endNav+ ' '+(Math.pow((endNav/startNav), (12/period)) - 1) * 100);
        const ratio = Math.pow((endNav/startNav), (12/period));
        return ( ratio * 100 - 100 );
    }

    findStartDateOfInvestment(horizon) {
        const latestNavDate = this.history.getLatestDate();
        return addMonths(latestNavDate, -1 * horizon);
    }
}