var isEqual = require('date-fns/isEqual');
var parse = require('date-fns/parse');
var isBefore = require('date-fns/isBefore')
var differenceInHours = require('date-fns/differenceInHours')

class HistoricalData {
    constructor(navHistory) {
        this.navHistory = navHistory;
    }

    static create(navHistory) {
        return new HistoricalData(navHistory);
    }

    getNav(date) {
        let nav = null;

        if ( this.navHistory.length == 0 )
            return nav;

        if ( isBefore(parse(this.navHistory[0].date, 'dd-MM-yyyy', date), date) )
            return nav;

        for ( var i=0; i<this.navHistory.length; i++ ) {
            let navDate = parse(this.navHistory[i].date, 'dd-MM-yyyy', date);
            if ( isEqual(navDate, date) ) {
                nav = parseFloat(this.navHistory[i].nav);
                break;
            }
            if ( isBefore(navDate, date) ) {
                if ( i !== 0 )
                    nav = parseFloat(this.navHistory[i-1].nav);
                break;
            }
        }
        return nav;
    }

    getLatestDate() {
        return parse(this.navHistory[0].date, 'dd-MM-yyyy', new Date());
    }
}

module.exports = HistoricalData;