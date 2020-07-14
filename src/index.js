const axios = require('axios');
const MovingAverage = require('./util/movingAverage.js')
const Report = require('./util/report.js')

async function fetch(mfCode) {
  try {
    let response = await axios.get(`https://api.mfapi.in/mf/${mfCode}`)
    return {meta: response.data.meta, navs: response.data.data};
  }
  catch(error) {
      console.log(error);
  };
}

function compute(data) {
  const calc = MovingAverage.create(data);
  return calc.computeReturns(36, 108);
}


async function runAll() {
  let schemeNavs = [];
  const period = 60;
  const horizon = 120;
  schemeNavs.push(await fetch(100356));//icici equity&debt
  // schemeNavs.push(await fetch(102885));//sbi equity hybrid


  //schemeNavs.push(await fetch(109740));//icici bond
  schemeNavs.push(await fetch(122639));//ppfas
  // schemeNavs.push(await fetch(102885));//sbi equity hybrid

  let calc = MovingAverage.create(schemeNavs[0].navs);
  let returns1 =  calc.computeReturns(period, horizon);
  calc = MovingAverage.create(schemeNavs[1].navs);
  let returns2 =  calc.computeReturns(period, horizon);
  let months = calc.getMonths();

  let schemes = [];
  schemeNavs.forEach((scheme) => schemes.push(scheme.meta.scheme_name));

  new Report().displayResults(schemes, months, returns1, returns2);
}

runAll();
