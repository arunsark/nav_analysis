const assert = require('chai').assert;
const HistoricalData = require('../src/util/historicalData.js')
var subDays = require('date-fns/subDays');

describe('historicalData.js', function () {
  describe('getNav', function () {

    it('should get NAV for the date', function () {
      const data = [{
          "date": "10-07-2020",
          "nav": "125.56000"
        },
        {
          "date": "09-07-2020",
          "nav": "126.21000"
        },
        {
          "date": "08-07-2020",
          "nav": "125.48000"
        }];

      const history = HistoricalData.create(data);
      let date = new Date(2020, 06, 10);
      assert.equal(125.56000, history.getNav(date));
      date = new Date(2020, 06, 09);
      assert.equal(126.21, history.getNav(date));
      date = new Date(2020, 06, 08);
      assert.equal(125.48, history.getNav(date));
      date = new Date(2020, 06, 1);
      assert.isNull(history.getNav(date));
    });

    it('should get next available NAV', function () {
      const data = [{
          "date": "10-07-2020",
          "nav": "125.56000"
        },
        {
          "date": "09-07-2020",
          "nav": "126.21000"
        },
        {
          "date": "08-07-2020",
          "nav": "125.48000"
        },
        {
          "date": "04-07-2020",
          "nav": "121.48000"
        }
      ];

      const history = HistoricalData.create(data);
      let date = new Date(2020, 06, 05);
      assert.equal(125.48, history.getNav(date));
    });

    it('should return null if no navHistory present', function() {
      let history = HistoricalData.create([]);
      assert.isNull(history.getNav(new Date()));

      history = HistoricalData.create([{date: "01-07-2020", nav: "100"}]);
      date = new Date(2020, 06, 03);
      assert.isNull(history.getNav(date));
    });
  });
});