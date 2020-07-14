const HistoricalData = require('./historicalData.js')
var isBefore = require('date-fns/isBefore')
var isEqual = require('date-fns/isEqual')
var addMonths = require('date-fns/addMonths')
var addDays = require('date-fns/addDays')
var format = require('date-fns/format')

module.exports = class MovingAverage {
    constructor(data) {
        this.history = HistoricalData.create(data);
    }

    static create(data) {
        return new MovingAverage(data);
    }

    computeReturns(periodOfInvestment, horizon) {
        let returns = [];
        let monthReturns = [];
        let installmentDate = this.findStartDateOfInvestment(horizon);

        let lastInstallmentDate = addMonths(installmentDate, (horizon-periodOfInvestment));
        let month = this.extractMonthFromDate(installmentDate);

        while ( isBefore(installmentDate, lastInstallmentDate) || isEqual(installmentDate, lastInstallmentDate) ) {
            let returnForAnInvestment = this.computeReturnsForAnInvestment(installmentDate, periodOfInvestment);
            if ( returnForAnInvestment !== null )
                monthReturns.push(returnForAnInvestment);
            installmentDate = addDays(installmentDate, 1);
            if ( month !== this.extractMonthFromDate(installmentDate) ) {
                returns.push(this.averageReturnsForInstallment(month, monthReturns));
                month = this.extractMonthFromDate(installmentDate);
                monthReturns = [];
            }
        }
        returns.push(this.averageReturnsForInstallment(month, monthReturns));
        // console.log(returns);
        return returns;
    }

    extractMonthFromDate(date) {
        return format(date, 'MMM-yy');
    }

    averageReturnsForInstallment(month, monthReturns) {
        if ( monthReturns.length == 0 )
        return {[month]: 0};
        const sum = monthReturns.reduce( (accumlator, currentValue) => accumlator + currentValue );
        // console.log('AVG '+month+ ' ' + sum+ ' '+monthReturns.length);
        return {[month]:  Math.round((sum/monthReturns.length)*100)/100 };
    }

    computeReturnsForAnInvestment(startDate, period) {
        let startNav = this.history.getNav(startDate);
        let endDate = addMonths(startDate, period);
        let endNav = this.history.getNav(endDate);
        // console.log('NAVS '+startDate+ ' '+ endDate+ ' ' +startNav+ ' ' +endNav);
        if ( startNav == null || endNav == null )
            return null;
        return (endNav - startNav);
    }

    findStartDateOfInvestment(horizon) {
        const latestNavDate = this.history.getLatestDate();
        return addMonths(latestNavDate, -1 * horizon);

    }
}