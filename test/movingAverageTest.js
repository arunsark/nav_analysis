const assert = require('chai').assert;
const MovingAverage = require('../src/util/movingAverage.js')
const NavDatas = require('./fixtures/navData.js')
var isEqual = require('date-fns/isEqual')

describe('movingAverage.js', function () {
  describe('computeReturnsForAnInvestment', function () {
    var data = [];
    var calc;
    before(function () {
      data = [{
        "date": "10-07-2020",
        "nav": "140"
      },
      {
        "date": "10-07-2019",
        "nav": "125"
      },
      {
        "date": "10-07-2018",
        "nav": "115"
      },
      {
        "date": "10-07-2017",
        "nav": "120"
      },
      {
        "date": "10-07-2016",
        "nav": "100"
      },
      ];
      calc = MovingAverage.create(data);
    });


    it('should compute returns', function () {
      let returns = calc.computeReturnsForAnInvestment(new Date(2016, 06, 10), 12);
      assert.equal(returns, 20);
    });

    it('should return null if data is not present', function () {
      let returns = calc.computeReturnsForAnInvestment(new Date(2015, 06, 10), 12);
      assert.isNull(returns);
    });
  });

  describe("findStartDateOfInvestment", function() {
    var data = [];
    var calc;
    before(function () {
      data = [{
        "date": "10-07-2020",
        "nav": "140"
      },
      ];
      calc = MovingAverage.create(data);
    });

    it ("should find the start date based on horizon", function() {
      assert.isTrue(isEqual(calc.findStartDateOfInvestment(12), new Date(2019, 06, 10)));
      assert.isTrue(isEqual(calc.findStartDateOfInvestment(24), new Date(2018, 06, 10)));
      assert.isTrue(isEqual(calc.findStartDateOfInvestment(120), new Date(2010, 06, 10)));
    });
  });

  describe('averageReturnsForInstallment', function () {
    it('finds average and return object', function () {
      let returns = MovingAverage.create([]).averageReturnsForInstallment([1,2,3,4]);
      assert.equal(returns, 2.5);
    });
  });

  describe('computeReturnsForAnInvestment', function () {
    var data = [];
    var calc;
    before(function () {
      data = [{
        "date": "10-07-2020",
        "nav": "140"
      },
      {
        "date": "10-07-2019",
        "nav": "125"
      },
      {
        "date": "10-07-2018",
        "nav": "115"
      },
      {
        "date": "10-07-2017",
        "nav": "120"
      },
      {
        "date": "10-07-2016",
        "nav": "100"
      },
      ];
      calc = MovingAverage.create(data);
    });


    it('should compute returns', function () {
      let returns = calc.computeReturnsForAnInvestment(new Date(2016, 06, 10), 12);
      assert.equal(returns, 20);
    });

    it('should return null if data is not present', function () {
      let returns = calc.computeReturnsForAnInvestment(new Date(2015, 06, 10), 12);
      assert.isNull(returns);
    });
  });

  describe('computeReturns', function () {
    it('should compute returns for one month poi & horizon', function () {
      const calc = MovingAverage.create(NavDatas[1]);
      const returns = calc.computeReturns(12, 12);
      assert.equal(returns['rolling'][0], 150);
      assert.equal(returns['trailing'][0], 150);
      assert.equal('Jul-20', calc.getMonths()[0]);
    });

    it('should compute zero returns if data is not there', function () {
      const calc = MovingAverage.create(NavDatas[1]);
      const returns = calc.computeReturns(12, 13);
      assert.equal(returns['rolling'][0], 0);
      assert.equal(returns['rolling'][1], 150);
      assert.equal(returns['trailing'][0], 0);
      assert.equal(returns['trailing'][1], 150);
      assert.equal('Jun-20', calc.getMonths()[0]);
      assert.equal('Jul-20', calc.getMonths()[1]);
    });

    it('should compute returns over poi & horizon', function() {
      const calc = MovingAverage.create(NavDatas[0]);
      const returns = calc.computeReturns(1, 2);
      assert.equal(returns['rolling'][0], 219458.63);
      assert.equal(returns['rolling'][1], 36074.03);
      assert.equal(returns['trailing'][0], 1285400.26);
      assert.equal('Jun-20', calc.getMonths()[0]);
      assert.equal('Jul-20', calc.getMonths()[1]);
    });
  });
});