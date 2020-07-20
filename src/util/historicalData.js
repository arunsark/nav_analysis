var parse = require('date-fns/parse')
var isBefore = require('date-fns/isBefore')
var isAfter = require('date-fns/isAfter')
var R = require('ramda')
var format = require('date-fns/format')

class HistoricalData {
    constructor(navHistory) {
        this.destructure(navHistory);
    }

    destructure(navHistory) {
        const extractPairs = (data) => R.values(data)
        this.history = R.compose(R.fromPairs, R.map(extractPairs))(navHistory)
        const diff = (a, b) => { return isBefore(a, b) ? -1 : 1 }
        this.allDates = R.pipe(R.keys, R.map(this.parseDate), R.sort(diff))(this.history)
        this.earliestDate = this.allDates[0]
        this.latestDate = this.allDates[this.allDates.length-1]
    }

    formatDate(date) {
        return format(date, 'dd-MM-yyyy')
    }

    parseDate(date) {
        return parse(date, 'dd-MM-yyyy', new Date())
    }

    getNextDate(date) {
        const itsAfter = (d) => { return isAfter(d, date) }
        return R.compose(this.formatDate, R.head, R.takeLastWhile(itsAfter))(this.allDates)
    }

    hasNoData() {
        return this.allDates.length == 0
    }

    static create(navHistory) {
        return new HistoricalData(navHistory)
    }

    getNav(date) {
        if ( this.hasNoData() )
            return null;
        if ( isBefore(date, this.earliestDate) )
            return null;
        if ( isBefore(this.latestDate, date) )
            return null;

        let formattedDate = this.formatDate(date);
        if ( this.history[formattedDate] !== undefined )
            return parseFloat(this.history[formattedDate])

        const nextDate = this.getNextDate(date)
        if ( this.history[nextDate] !== undefined )
            return parseFloat(this.history[nextDate])

        return null;
    }

    getLatestDate() {
        return this.latestDate;
    }
}

module.exports = HistoricalData;