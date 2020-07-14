var add = require('date-fns/add');
var format = require('date-fns/format');
const axios = require('axios');
let navs =[];

axios.get('https://api.mfapi.in/mf/100356')
  .then(response => {
    console.log(response.data.meta.fund_house);
    navs = response.data.data;
    console.log(navs.length);
  })
  .catch(error => {
    console.log(error);
  });


const startDate = new Date(2003, 03, 01);
const endDate = new Date(2018, 02, 31);

console.log(add(startDate, {years: 15}));
console.log(format(endDate, 'dd-MM-yyyy'));
